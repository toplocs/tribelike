"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@simplewebauthn/server");
const config_1 = require("../../config");
const models_1 = require("../../models");
const error_1 = require("../../lib/error");
class PasskeyController {
    static async handleRegisterStart(req, res, next) {
        const { email } = req.body;
        if (!email) {
            return next(new error_1.CustomError('Email empty', 400));
        }
        let user = await models_1.users.getByEmail(email);
        let existingUserPasskeys = [];
        if (user) {
            existingUserPasskeys = await models_1.passkeys.getAllByUserId(user.id);
        }
        try {
            const options = await (0, server_1.generateRegistrationOptions)({
                rpName: config_1.rpName,
                rpID: config_1.rpID,
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
            const session = await models_1.sessions.createToken({
                currentChallengeOptions: options,
                loggedInUser: { id: options.user.id, email: email },
            }, 5 // 5 minutes expiration
            );
            res.send({ registrationOptions: options, token: session.token });
        }
        catch (error) {
            next(error instanceof error_1.CustomError ? error : new error_1.CustomError('Internal Server Error: ' + error, 500));
        }
    }
    static async handleRegisterFinish(req, res, next) {
        const { body } = req;
        const token = req.get('Authorization');
        if (!token)
            return next(new error_1.CustomError('Unauthorized. Authorization Header not found', 401));
        const session = await models_1.sessions.validateToken(token);
        if (!session)
            return next(new error_1.CustomError('Unauthorized. Session not valid', 401));
        if (!('currentChallengeOptions' in session.data) || !('loggedInUser' in session.data)) {
            return next(new error_1.CustomError('Unauthorized. Session not valid', 401));
        }
        if (!session.data.currentChallengeOptions) {
            return next(new error_1.CustomError('Current challenge is missing', 400));
        }
        if (!session.data.loggedInUser) {
            return next(new error_1.CustomError('User ID is missing', 400));
        }
        const loggedInUser = session.data.loggedInUser;
        const currentChallengeOptions = session.data.currentChallengeOptions;
        const currentChallenge = currentChallengeOptions.challenge;
        try {
            const verification = await (0, server_1.verifyRegistrationResponse)({
                response: body,
                expectedChallenge: currentChallenge,
                expectedOrigin: config_1.origin,
                expectedRPID: [config_1.rpID, "localhost"],
                requireUserVerification: false,
            });
            const { verified, registrationInfo } = verification;
            if (!verified || !registrationInfo) {
                return next(new error_1.CustomError('Verification failed', 400));
            }
            const user = await models_1.users.getById(loggedInUser.id);
            if (!user) {
                return next(new error_1.CustomError('User not found', 400));
            }
            const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;
            const newPasskey = new models_1.PasskeyCredential({
                id: credential.id,
                publicKey: Buffer.from(credential.publicKey).toString('base64'),
                userId: user.id,
                webauthnUserID: currentChallengeOptions.user.id,
                counter: credential.counter,
                deviceType: credentialDeviceType,
                transports: credential.transports,
                backedUp: credentialBackedUp,
            });
            const passkey = await models_1.passkeys.create(newPasskey);
            if (!passkey) {
                return next(new error_1.CustomError('Credential Create failed', 400));
            }
            res.send({ verified: true });
        }
        catch (error) {
            console.error(error);
            next(error instanceof error_1.CustomError ? error : new error_1.CustomError('Internal Server Error', 500));
        }
    }
    static async handleLoginStart(req, res, next) {
        const { email } = req.body;
        console.log('Login Start:', email);
        try {
            const user = await models_1.users.getByEmail(email);
            if (!user) {
                return next(new error_1.CustomError('User not found', 404));
            }
            const userPasskeys = await models_1.passkeys.getAllByUserId(user.id);
            if (userPasskeys.length === 0) {
                return next(new error_1.CustomError('No passkeys registered', 404));
            }
            const options = await (0, server_1.generateAuthenticationOptions)({
                rpID: config_1.rpID,
                timeout: 60000,
                allowCredentials: [],
                // allowCredentials: userPasskeys.map(passkey => ({
                //     id: passkey.id,
                //     transports: passkey.transports,
                // })),
                userVerification: 'preferred',
            });
            const session = await models_1.sessions.createToken({
                currentChallengeOptions: options,
                loggedInUser: { id: user.id, email: user.email },
            }, 5 // 5 minutes expiration
            );
            res.send({ loginOptions: options, token: session.token });
        }
        catch (error) {
            next(error instanceof error_1.CustomError ? error : new error_1.CustomError('Internal Server Error', 500));
        }
    }
    static async handleLoginFinish(req, res, next) {
        const { body } = req;
        const token = req.get('Authorization');
        if (!token)
            return next(new error_1.CustomError('Unauthorized. Authorization Header not found', 401));
        const session = await models_1.sessions.validateToken(token);
        if (!session)
            return next(new error_1.CustomError('Unauthorized. Session not valid', 401));
        if (!('currentChallengeOptions' in session.data) || !('loggedInUser' in session.data)) {
            return next(new error_1.CustomError('Unauthorized. Session not valid', 401));
        }
        if (!session.data.currentChallengeOptions) {
            return next(new error_1.CustomError('Current challenge is missing', 400));
        }
        if (!session.data.loggedInUser) {
            return next(new error_1.CustomError('User ID is missing', 400));
        }
        const loggedInUser = session.data.loggedInUser;
        const currentChallengeOptions = session.data.currentChallengeOptions;
        const currentChallenge = currentChallengeOptions.challenge;
        const user = await models_1.users.getById(loggedInUser.id);
        if (!user) {
            return next(new error_1.CustomError('User not found', 404));
        }
        const userPasskey = await models_1.passkeys.getById(body.id);
        if (!userPasskey || userPasskey.userId !== user.id) {
            return next(new error_1.CustomError('Passkey not registered with this site', 404));
        }
        try {
            const authenticationResponse = {
                response: body,
                expectedChallenge: currentChallenge,
                expectedOrigin: config_1.origin,
                expectedRPID: [config_1.rpID, "localhost"],
                credential: {
                    id: userPasskey.id,
                    publicKey: models_1.PasskeyCredential.base64ToUint8Array(userPasskey.publicKey),
                    counter: userPasskey.counter,
                    transports: userPasskey.transports,
                },
            };
            let verification = await (0, server_1.verifyAuthenticationResponse)(authenticationResponse);
            const { verified, authenticationInfo } = verification;
            if (verified) {
                await models_1.passkeys.updateCounter(userPasskey.id, authenticationInfo.newCounter);
                const sessionData = {
                    userId: user.id,
                };
                const { token } = await models_1.sessions.createToken(sessionData);
                res.send({ verified: true, user: user, token: token });
            }
            else {
                next(new error_1.CustomError('Verification failed', 400));
            }
        }
        catch (error) {
            next(error instanceof error_1.CustomError ? error : new error_1.CustomError('Internal Server Error' + error, 500));
        }
    }
}
exports.default = PasskeyController;
