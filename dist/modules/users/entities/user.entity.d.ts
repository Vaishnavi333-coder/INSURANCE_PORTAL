import { Policy } from "src/modules/policies/entities/policy.entity";
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    userId: number;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    refreshToken: string | null;
    lastActivity: Date | null;
    policies: Policy[];
}
