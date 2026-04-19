import { JwtPayload } from './jwt-payload.type';
export type AuthenticatedRequestUser = JwtPayload & {
    refreshToken?: string;
};
