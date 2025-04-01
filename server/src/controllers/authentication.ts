import { Request, Response, NextFunction } from 'express';
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import { CustomError } from '../middleware/error';
import { rpID, origin } from '../config';
import { users, credentials, sessions, Credential, AuthSessionData, magicLinks } from '../models';

export const handleMagicLinkLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const userId = await magicLinks.isValid(token);
    if (userId) {
        const user = await users.getById(userId);
        console.log(user);
    }
}

export const handleLoginStart = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const handleLoginFinish = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const handleLogout = async (req: Request, res: Response) => {
  try {
    // Todo: Invalidate the session token
  } catch (error) {
    res.status(500).send({ message: 'Logout failed', error });
  }
};