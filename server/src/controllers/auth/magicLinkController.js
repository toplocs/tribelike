"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const error_1 = require("../../lib/error");
const email_1 = require("../../lib/email");
const config_1 = require("../../config");
class MagicLinkController {
    static async handleMagicLinkLogin(req, res, next) {
        try {
            const { token } = req.params;
            const userId = await models_1.magicLinks.consumeToken(token);
            if (!userId) {
                throw new error_1.CustomError('Magic link is not valid', 400);
            }
            const user = await models_1.users.getById(userId);
            if (!user) {
                throw new error_1.CustomError('Magic link is not valid', 400);
            }
            user.emailVerified = true;
            await models_1.users.update(userId, user);
            const session = await models_1.sessions.createToken({
                userId: user.id,
            });
            res.send({
                userId: user.id,
                token: session.token,
                expires: session.expires,
                loggedIn: true
            });
        }
        catch (error) {
            (0, error_1.handleError)(error, res);
        }
    }
    // move to userController.Create
    static async handleAccountCreate(req, res, next) {
        const { email, username } = req.body;
        if (!username) {
            return next(new error_1.CustomError('Username empty', 400));
        }
        if (!email) {
            return next(new error_1.CustomError('Email empty', 400));
        }
        try {
            let user = await models_1.users.getByEmail(email);
            if (user) {
                return next(new error_1.CustomError('User already exists', 400));
            }
            user = await models_1.users.create({
                email: email
            });
            const predefineds = ['Work', 'Friends', 'Private'];
            for (let pre of predefineds) {
                await models_1.profiles.create({
                    type: pre,
                    ...user,
                });
            }
            if (!user) {
                return next(new error_1.CustomError('User Create failed', 400));
            }
            if (!user.id) {
                return next(new error_1.CustomError('User Create failed', 400));
            }
            const { token } = await models_1.sessions.createToken({
                userId: user.id,
            });
            const magicLink = models_1.magicLinks.create({
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
            await (0, email_1.sendMail)(user.email, 'Register complete!', template);
            res.send({ token: token });
        }
        catch (error) {
            (0, error_1.handleError)(error, res);
        }
    }
    static async sendMagicLink(req, res, next) {
        try {
            const { to } = await req.body;
            const user = await models_1.users.getByEmail(to);
            if (!user)
                throw new error_1.CustomError('User does not exist', 400);
            const magicLink = await models_1.magicLinks.create({
                userId: user.id,
            });
            if (!magicLink)
                throw new error_1.CustomError('No magic link', 400);
            const subject = 'Login successfull!';
            const template = `
        <div>
          <h2 class="font-bold">Thank you for using Toplocs!</h2>
          <p>
            Please, click on the button to login automatically.
          </p>
          <a
            href="${config_1.url}/magicLink/${magicLink?.token}"
            class="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          > Open Magic Link
          </a>
        </div>
      `;
            if (!to || !subject) {
                throw new Error('Missing required fields');
            }
            console.log(`${config_1.url}/magicLink/${magicLink?.token}`);
            await (0, email_1.sendMail)(to, subject, template);
            res.send({ verified: true });
        }
        catch (error) {
            (0, error_1.handleError)(error, res);
        }
    }
    static async resendMagicLink(req, res, next) {
        const { to, subject, name } = await req.body;
        const userId = 'test';
        const magicLink = await models_1.magicLinks.create({
            userId: userId
        });
        if (!magicLink)
            next(new error_1.CustomError('No magic link', 400));
        console.log(magicLink);
        const template = `
      <div>
        <h2 class="font-bold">Thank you for registering on Toplocs!</h2>
        <p>
          Please, click on the button to verify your email address and to login automatically.
        </p>
        <a
          href="${config_1.url}/api/auth/magicLink/${magicLink?.token}"
          class="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        > Open Magic Link
        </a>
      </div>
    `;
        if (!to || !subject || !name) {
            throw new Error('Missing required fields');
        }
        try {
            await (0, email_1.sendMail)(to, subject, template);
            res.send({ verfied: true });
        }
        catch (error) {
            (0, error_1.handleError)(error, res);
        }
    }
}
exports.default = MagicLinkController;
