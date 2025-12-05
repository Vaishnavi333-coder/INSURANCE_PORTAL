import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CustomLoggerService } from 'src/common/logger';
export declare class PoliciesController {
    private readonly policiesService;
    private readonly logger;
    constructor(policiesService: PoliciesService, logger: CustomLoggerService);
    create(req: any, createPolicyDto: CreatePolicyDto): Promise<import("./entities/policy.entity").Policy | null>;
    findAll(req: any): Promise<{
        insurer: string;
        coverage: number;
        planId: number;
        createdAt: Date;
        updatedAt: Date;
        policyId: number;
        userId: number;
        plan: import("../plans/entities/plans.entity").Plan;
        policyType: import("./entities/policy.entity").PolicyType;
        premiumAmount: number;
        startDate: Date;
        endDate: Date;
        status: import("./entities/policy.entity").PolicyStatus;
        user: import("src/modules/users/entities/user.entity").User;
        claims: import("../claims/entities/claim.entity").Claim[];
        deleted: boolean;
    }[]>;
    findAllPoliciesAdmin(): Promise<{
        insurer: string;
        planId: number;
        user: {
            id: number;
            email: string;
            name: string;
        } | null;
        createdAt: Date;
        updatedAt: Date;
        policyId: number;
        userId: number;
        plan: import("../plans/entities/plans.entity").Plan;
        policyType: import("./entities/policy.entity").PolicyType;
        premiumAmount: number;
        startDate: Date;
        endDate: Date;
        status: import("./entities/policy.entity").PolicyStatus;
        claims: import("../claims/entities/claim.entity").Claim[];
        deleted: boolean;
    }[]>;
    findAllPolicies(): Promise<{
        insurer: string;
        planId: number;
        user: {
            id: number;
            email: string;
            name: string;
        } | null;
        createdAt: Date;
        updatedAt: Date;
        policyId: number;
        userId: number;
        plan: import("../plans/entities/plans.entity").Plan;
        policyType: import("./entities/policy.entity").PolicyType;
        premiumAmount: number;
        startDate: Date;
        endDate: Date;
        status: import("./entities/policy.entity").PolicyStatus;
        claims: import("../claims/entities/claim.entity").Claim[];
        deleted: boolean;
    }[]>;
    findOne(req: any, id: string): Promise<import("./entities/policy.entity").Policy>;
    update(req: any, id: string, updatePolicyDto: UpdatePolicyDto): Promise<import("./entities/policy.entity").Policy | null>;
    remove(req: any, id: string): Promise<"Policy Does Not Exists" | "Policy Deleted Successfully">;
}
