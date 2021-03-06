import jwt from 'jsonwebtoken';
import config from '../config/config';

/**
 * Check token
 * @param req Request
 * @param res Response
 * @param next Next step on request
 */
export const checkToken = (req, res, next) => {

    const token = req.get('Authorization');

    jwt.verify(token, config.jwtSecret, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                status: "error",
                message: error
            });
        }

        req.user = decoded.user;
        next();

    });
}