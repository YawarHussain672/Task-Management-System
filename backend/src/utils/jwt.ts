import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface TokenPayload {
    userId: string;
    email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    const options: SignOptions = { expiresIn: ACCESS_EXPIRY as any };
    return jwt.sign(payload, ACCESS_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    const options: SignOptions = { expiresIn: REFRESH_EXPIRY as any };
    return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload & TokenPayload;
    return { userId: decoded.userId, email: decoded.email };
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    const decoded = jwt.verify(token, REFRESH_SECRET) as JwtPayload & TokenPayload;
    return { userId: decoded.userId, email: decoded.email };
};

export const generateTokens = (payload: TokenPayload) => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};
