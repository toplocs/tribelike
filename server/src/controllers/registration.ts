import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import { generateRegistrationOptions, verifyRegistrationResponse, WebAuthnCredential } from '@simplewebauthn/server';
import { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";
import { rpName, rpID, origin } from '../config';
import { Credential } from '../models/Credential';
import { users, credentials, profiles } from '../models';
import { CustomError } from '../middleware/error';
import { EmailTemplate } from '../lib/email';

const url = process.env.URL;
const template = `
    <div>
      <h2 class="font-bold">Thank you for registering on Toplocs!</h2>
      <p>
        Please, click on the button to verify your email address and to login automatically.
      </p>
      <a
        href="${url}/auth/magicLink/"
        class="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      > Open Magic Link
      </a>
    </div>
`;

const sendMail = async (to: string, subject: string) => {
  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);
  const htmlTemplate = EmailTemplate(template);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('🚀 Email sent successfully!');
  } catch (error) {
    console.error(error)
  }
}

export const resendMagicLink = async (req: Request, res: Response, next: NextFunction) => {
  const { to, subject, name } = await req.body;

  if (!to || !subject || !name) {
    throw new Error('Missing required fields');
  }

  try {
    await sendMail(to, subject);

    res.send({ verfied: true });
  } catch (error) {
    console.error(error)
    next(error instanceof CustomError ? error : new CustomError('Internal Server Error', 500));
  }
}

export const handleRegisterStart = async (req: Request, res: Response, next: NextFunction) => {
    const {email, username} = req.body;

    if (!username) {
        return next(new CustomError('Username empty', 400));
    }
    if (!email) {
        return next(new CustomError('Email empty', 400));
    }

    let user = await users.getByUsername(username);
    let existingUserPasskeys: Credential[] = [];
    if (user) {
        existingUserPasskeys = await credentials.getAllByUserId(user.id);
    }

    try {
        const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
            rpName,
            rpID,
            userName: username,
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

        req.session.loggedInUser = options.user;
        req.session.currentChallengeOptions = options;

        res.send(options);
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error' + error, 500));
    }
};

export const handleRegisterFinish = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    if (!req.session.currentChallengeOptions) {
        return next(new CustomError('Current challenge is missing', 400));
    }

    if (!req.session.loggedInUser) {
        return next(new CustomError('User ID is missing', 400));
    }

    const currentChallengeOptions = req.session.currentChallengeOptions as PublicKeyCredentialCreationOptionsJSON;
    const currentChallenge = currentChallengeOptions.challenge;

    try {
        const verification = await verifyRegistrationResponse({
            response: body as RegistrationResponseJSON,
            expectedChallenge: currentChallenge,
            expectedOrigin: origin,
            expectedRPID: [rpID, "localhost"],
            requireUserVerification: false,
        });

        const { verified } = verification;
        const { registrationInfo } = verification;
        if (verified && registrationInfo) {
            const {
                credential,
                credentialDeviceType,
                credentialBackedUp,
            } = registrationInfo;

            const user = await users.create({
                id: req.session.loggedInUser.id,
                username: req.session.loggedInUser.name,
                email: req.session.loggedInUser.name + "@toplocs.com"
            });
            if (!user) {
                return next(new CustomError('User Create failed', 400));
            }

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
            
            await profiles.createDefaultProfiles(user.id, user.username, user.email);
            await sendMail(user.email, 'Finish your registration');

            res.send({verified: true});
        } else {
            next(new CustomError('Verification failed', 400));
        }
    } catch (error) {
        console.error(error)
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error', 500));
    } finally {
        req.session.loggedInUser = null;
        req.session.currentChallengeOptions = undefined;
    }
};