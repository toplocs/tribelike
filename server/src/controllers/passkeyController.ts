import { Request, Response, NextFunction } from 'express';
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { RegistrationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import { rpName, rpID, origin } from '../config';
import { users, credentials, sessions, Credential, AuthSessionData } from '../models';
import { CustomError } from '../middleware/error';

export default class PasskeyController {

  static async handleRegisterStart(req: Request, res: Response, next: NextFunction) {
    const {email} = req.body;

    if (!email) {
      return next(new CustomError('Email empty', 400));
    }

    let user = await users.getByEmail(email);
    let existingUserPasskeys: Credential[] = [];
    if (user) {
      existingUserPasskeys = await credentials.getAllByUserId(user.id);
    }

    try {
      const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
        rpName,
        rpID,
        userName: email,
        timeout: 60000,
        attestationType: 'direct',
        // attestationType: 'none',
        excludeCredentials: existingUserPasskeys.map(passkey => ({
          id: passkey.id,
          transports: passkey.transports,
        })),
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
        // Support for the two most common algorithms: ES256, and RS256
        supportedAlgorithmIDs: [-7, -257],
      });

      const session = await sessions.createToken(
        {
          currentChallengeOptions: options,
          loggedInUser: {id: options.user.id, email: email},
        },
        5 // 5 minutes expiration
      ); 

      res.send({ registrationOptions: options, token: session.token });
    } catch (error) {
      next(error instanceof CustomError ? error : new CustomError('Internal Server Error: ' + error, 500));
    }
  }

  static async handleRegisterFinish(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    const token = req.get('Authorization');    
    if (!token) return next(new CustomError('Unauthorized. Authorization Header not found', 401));

    const session = await sessions.validateToken(token);
    if (!session) return next(new CustomError('Unauthorized. Session not valid', 401));
    
    if (!('currentChallengeOptions' in session.data) || !('loggedInUser' in session.data)) {
      return next(new CustomError('Unauthorized. Session not valid', 401));
    }

    if (!session.data.currentChallengeOptions) {
      return next(new CustomError('Current challenge is missing', 400));
    }

    if (!session.data.loggedInUser) {
      return next(new CustomError('User ID is missing', 400));
    }

    const loggedInUser = session.data.loggedInUser;
    const currentChallengeOptions = session.data.currentChallengeOptions as PublicKeyCredentialCreationOptionsJSON;
    const currentChallenge = currentChallengeOptions.challenge;

    try {
      const verification = await verifyRegistrationResponse({
        response: body as RegistrationResponseJSON,
        expectedChallenge: currentChallenge,
        expectedOrigin: origin,
        expectedRPID: [rpID, "localhost"],
        requireUserVerification: false,
      });

      const { verified, registrationInfo } = verification;
      if (!verified || !registrationInfo) {
        return next(new CustomError('Verification failed', 400));
      }

      const user = await users.getById(loggedInUser.id);
      if (!user) {
        return next(new CustomError('User not found', 400));
      }
      
      const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;
      const newPasskey = new Credential({
        id: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString('base64'),
        userId: user.id,
        webauthnUserID: currentChallengeOptions.user.id,
        counter: credential.counter,
        deviceType: credentialDeviceType,
        transports: credential.transports,
        backedUp: credentialBackedUp,
      });
      const passkey = await credentials.create(newPasskey);

      if (!passkey) {
          return next(new CustomError('Credential Create failed', 400));
      }

      res.send({verified: true});
    } catch (error) {
      console.error(error)
      next(error instanceof CustomError ? error : new CustomError('Internal Server Error', 500));
    }
  }

  static async handleLoginStart(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    console.log('Login Start:', email);

    try {
        const user = await users.getByEmail(email);

        if (!user) {
            return next(new CustomError('User not found', 404));
        }

        const userPasskeys: Credential[] = await credentials.getAllByUserId(user.id);
        if (userPasskeys.length === 0) {
            return next(new CustomError('No passkeys registered', 404));
        }
        
        const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
            rpID,
            timeout: 60000,
            allowCredentials: [],
            // allowCredentials: userPasskeys.map(passkey => ({
            //     id: passkey.id,
            //     transports: passkey.transports,
            // })),
            userVerification: 'preferred',
        });

        const session = await sessions.createToken(
            {
            currentChallengeOptions: options,
            loggedInUser: {id: user.id, email: user.email},
            },
            5 // 5 minutes expiration
        ); 

        res.send({ loginOptions: options, token: session.token });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error', 500));
    }
  }

  static async handleLoginFinish(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    const token = req.get('Authorization');    
    if (!token) return next(new CustomError('Unauthorized. Authorization Header not found', 401));

    const session = await sessions.validateToken(token);
    if (!session) return next(new CustomError('Unauthorized. Session not valid', 401));
    
    if (!('currentChallengeOptions' in session.data) || !('loggedInUser' in session.data)) {
        return next(new CustomError('Unauthorized. Session not valid', 401));
    }

    if (!session.data.currentChallengeOptions) {
        return next(new CustomError('Current challenge is missing', 400));
    }

    if (!session.data.loggedInUser) {
        return next(new CustomError('User ID is missing', 400));
    }

    const loggedInUser = session.data.loggedInUser;
    const currentChallengeOptions = session.data.currentChallengeOptions as PublicKeyCredentialCreationOptionsJSON;
    const currentChallenge = currentChallengeOptions.challenge;
    const user = await users.getById(loggedInUser.id);
    if (!user) {
        return next(new CustomError('User not found', 404));
    }
    const userPasskey = await credentials.getById(body.id);
    if (!userPasskey || userPasskey.userId !== user.id) {
        return next(new CustomError('Passkey not registered with this site', 404));
    }

    try {
        const authenticationResponse = {
            response: body,
            expectedChallenge: currentChallenge,
            expectedOrigin: origin,
            expectedRPID: [rpID, "localhost"],
            credential: {
                id: userPasskey.id,
                publicKey: Credential.base64ToUint8Array(userPasskey.publicKey),
                counter: userPasskey.counter,
                transports: userPasskey.transports,
            },
        };
        let verification = await verifyAuthenticationResponse(authenticationResponse);

        const { verified, authenticationInfo } = verification;

        if (verified) {
            await credentials.updateCounter(
                userPasskey.id,
                authenticationInfo.newCounter
            );
            const sessionData: AuthSessionData = {
                userId: user.id,
            }
            const { token }  = await sessions.createToken(sessionData);
            res.send({ verified: true, user: user, token: token });
        } else {
            next(new CustomError('Verification failed', 400));
        }
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error' + error, 500));
    }
  }
}