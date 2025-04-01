import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";
import { rpName, rpID, origin } from '../config';
import { users, credentials, profiles, sessions, Credential, magicLinks } from '../models';
import { CustomError } from '../middleware/error';
import { EmailTemplate } from '../lib/email';
import { AuthenticatedRequest } from '../middleware/authenticate';

const url = process.env.URL;

const sendMail = async (to: string, subject: string, template: string) => {
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
  const userId = 'test';
  const magicLink = await magicLinks.create({
    userId: userId
  });
  if (!magicLink) next(new CustomError('No magic link', 400));
  console.log(magicLink)
  const template = `
    <div>
      <h2 class="font-bold">Thank you for registering on Toplocs!</h2>
      <p>
        Please, click on the button to verify your email address and to login automatically.
      </p>
      <a
        href="${url}/api/auth/magicLink/${magicLink?.token}"
        class="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      > Open Magic Link
      </a>
    </div>
  `;

  if (!to || !subject || !name) {
    throw new Error('Missing required fields');
  }

  try {
    await sendMail(to, subject, template);

    res.send({ verfied: true });
  } catch (error) {
    console.error(error)
    next(error instanceof CustomError ? error : new CustomError('Internal Server Error', 500));
  }
}

export const handleAccountCreate = async (req: Request, res: Response, next: NextFunction) => {
  const {email, username} = req.body;

  if (!username) {
      return next(new CustomError('Username empty', 400));
  }
  if (!email) {
      return next(new CustomError('Email empty', 400));
  }

  try {
    let user = await users.getByEmail(email);
    if (user) {
      return next(new CustomError('User already exists', 400));
    }

    user = await users.create({
      email: email
    });

    if (!user) {
        return next(new CustomError('User Create failed', 400));
    }
    if (!user.id) {
      return next(new CustomError('User Create failed', 400));
    }

    const { token } = await sessions.createToken({
      userId: user.id,
    });
    const magicLink = magicLinks.create({
      userId: user.id
    });
    const template = `
      <div>
        <h2 class="font-bold">Thank you for registering on Toplocs!</h2>
        <p>
          Please, click on the button to verify your email address and to login automatically.
        </p>
        <a
          href="${magicLink}"
          class="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        > Open Magic Link
        </a>
      </div>
    `;
    //await sendMail(user.email, 'Register complete!', template);

    res.send({ token: token });
  } catch(error) {
    next(error instanceof CustomError ? error : new CustomError('Internal Server Error' + error, 500));
  }
}
