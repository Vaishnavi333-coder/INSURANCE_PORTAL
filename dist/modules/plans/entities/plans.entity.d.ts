import { Policy } from "src/modules/policies/entities/policy.entity";
export declare class Plan {
    planId: number;
    name: string;
    description: string;
    insurer: string;
    premiumAmount: number;
    coverageAmount: number;
    category: string;
    policies: Policy[];
}
