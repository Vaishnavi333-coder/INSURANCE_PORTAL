import { Policy } from "src/modules/policies/entities/policy.entity";
export declare enum ClaimStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_REVIEW = "in_review"
}
export declare class Claim {
    claimId: number;
    userId: number;
    claimAmount: number;
    description: string;
    status: ClaimStatus;
    rejectionReason: string | null;
    submittedAt: Date;
    policy: Policy;
    deleted: boolean;
}
