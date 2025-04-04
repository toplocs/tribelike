import { Request, Response, NextFunction } from 'express';
import { users, sessions, magicLinks } from '../../models';
import { CustomError, handleError } from '../../lib/error';
import { sendMail } from '../../lib/email';
import { url } from '../../config';


export default class MagicLinkController {
  static async handleMagicLinkLogin(req: Request, res: Response, next: NextFunction){
    try {
      const { token } = req.params;
      const userId = await magicLinks.consumeToken(token);
      if (!userId) {
        throw new CustomError('Magic link is not valid', 400);
      }
      const user = await users.getById(userId);
      if (!user) {
        throw new CustomError('Magic link is not valid', 400);
      }
      user.emailVerified = true;
      await users.update(userId, user);
      
      console.log(user);
      const session = await sessions.createToken({
        userId: user.id,
      });

      res.send({
        userId: user.id, 
        token: session.token, 
        expires: session.expires, 
        loggedIn: true
      });
    } catch(error: any) {
      handleError(error, res);
    }
  }
  
  // move to userController.Create
  static async handleAccountCreate(req: Request, res: Response, next: NextFunction) {
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
      await sendMail(user.email, 'Register complete!', template);
  
      res.send({ token: token });
    } catch(error: any) {
      handleError(error, res);
    }
  }

  static async sendMagicLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { to } = await req.body;
      const user = await users.getByEmail(to);
      if (!user) throw new CustomError('User does not exist', 400);
      const magicLink = await magicLinks.create({
        userId: user.id,
      });
      if (!magicLink) throw new CustomError('No magic link', 400);
      const subject = 'Login successfull!';
      const template = `
        <div>
          <h2 class="font-bold">Thank you for using Toplocs!</h2>
          <p>
            Please, click on the button to login automatically.
          </p>
          <a
            href="${url}/magicLink/${magicLink?.token}"
            class="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          > Open Magic Link
          </a>
        </div>
      `;
    
      if (!to || !subject) {
        throw new Error('Missing required fields');
      }
  
      await sendMail(to, subject, template);
  
      res.send({ verified: true });
    } catch (error: any) {
      handleError(error, res);
    }
  }
  
  static async resendMagicLink(req: Request, res: Response, next: NextFunction) {
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
    } catch (error: any) {
      handleError(error, res);
    }
  }
}