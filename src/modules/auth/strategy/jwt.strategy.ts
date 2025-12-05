import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_SECRET') || "Anupam-Kumar",
        });
    }

    validate(payload: any) {

        //payload = {userId: 1, email: 'test@test.com', role: 'admin'}
        return payload;
    }
}