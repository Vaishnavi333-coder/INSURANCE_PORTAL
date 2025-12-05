import { Claim } from "src/modules/claims/entities/claim.entity";
import { Plan } from "src/modules/plans/entities/plans.entity";
import { User } from "src/modules/users/entities/user.entity";
export declare enum PolicyType {
    HOME = "home",
    MOTOR = "motor",
    TRAVEL = "travel",
    HEALTH = "health",
    ACCIDENT = "accident",
    OTHER = "other",
    LIFE = "life"
}
export declare enum PolicyStatus {
    LAPSED = "lapsed",
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare class Policy {
    policyId: number;
    userId: number;
    plan: Plan;
    policyType: PolicyType;
    premiumAmount: number;
    startDate: Date;
    endDate: Date;
    status: PolicyStatus;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    claims: Claim[];
    deleted: boolean;
}
