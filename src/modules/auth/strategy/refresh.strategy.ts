import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()

    export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_REFRESH_SECRET') || "Anupam-Kumar",
            passReqToCallback: true, //to access request in validate
        });
    }
    
    validate(req: any, payload: any) {
        const refreshToken = req?.body?.refreshToken || req?.cookies?.Refresh;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }
        return payload;
    }
}