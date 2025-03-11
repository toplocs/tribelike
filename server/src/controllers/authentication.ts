import { Request, Response, NextFunction } from 'express';
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import { Credential } from '../models/Credential';
import { CustomError } from '../middleware/error';
import { rpID, origin } from '../config';
import { session, users, credentials } from '../models';

export const handleLoginStart = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email } = req.body;

    try {
        const user = await users.getByUsername(username);
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

        req.session.loggedInUser = { id: user.id, name: user.username };
        req.session.currentChallengeOptions = options;

        res.send(options);
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error', 500));
    }
};

export const handleLoginFinish = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    if (!req.session.currentChallengeOptions) {
        return next(new CustomError('Current challenge is missing', 400));
    }

    if (!req.session.loggedInUser) {
        return next(new CustomError('User is missing', 400));
    }

    const currentChallengeOptions = req.session.currentChallengeOptions as PublicKeyCredentialRequestOptionsJSON;
    const currentChallenge = currentChallengeOptions.challenge;
    const loggedInUserId = req.session.loggedInUser.id as string;
    const user = await users.getById(loggedInUserId);
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
            //const authToken = await session.createToken(user.id);
            //set express session to loggedin = true
            console.log(req.session.id)

            res.send({verified: true, user: user});
        } else {
            next(new CustomError('Verification failed', 400));
        }
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error' + error, 500));
    } finally {
        req.session.currentChallengeOptions = undefined;
        req.session.loggedInUser = undefined;
    }
};

export const handleLogout = async (req: Request, res: Response) => {
  try {
    req.session.loggedInUser = undefined;
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send({ message: 'Logout failed', error: err });
      }
      res.status(200).send({ message: 'Logout successful' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Logout failed', error });
  }
};