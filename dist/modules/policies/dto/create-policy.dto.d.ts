import { PolicyStatus, PolicyType } from "../entities/policy.entity";
export declare class CreatePolicyDto {
    policyType: PolicyType;
    planId: number;
    premiumAmount: number;
    startDate: Date;
    endDate: Date;
    status: PolicyStatus;
}
