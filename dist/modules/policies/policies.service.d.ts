import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { Policy } from './entities/policy.entity';
import { Repository } from 'typeorm';
import { Plan } from 'src/modules/plans/entities/plans.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { CustomLoggerService } from 'src/common/logger';
export declare class PoliciesService {
    private policyRepository;
    private planRepository;
    private userRepository;
    private logger;
    constructor(policyRepository: Repository<Policy>, planRepository: Repository<Plan>, userRepository: Repository<User>, logger: CustomLoggerService);
    create(createPolicyDto: CreatePolicyDto, userId: number): Promise<Policy | null>;
    findAll(userId: number): Promise<{
        insurer: string;
        coverage: number;
        planId: number;
        createdAt: Date;
        updatedAt: Date;
        policyId: number;
        userId: number;
        plan: Plan;
        policyType: import("./entities/policy.entity").PolicyType;
        premiumAmount: number;
        startDate: Date;
        endDate: Date;
        status: import("./entities/policy.entity").PolicyStatus;
        user: User;
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
        plan: Plan;
        policyType: import("./entities/policy.entity").PolicyType;
        premiumAmount: number;
        startDate: Date;
        endDate: Date;
        status: import("./entities/policy.entity").PolicyStatus;
        claims: import("../claims/entities/claim.entity").Claim[];
        deleted: boolean;
    }[]>;
    findOne(id: number): Promise<Policy>;
    update(id: number, updatePolicyDto: UpdatePolicyDto): Promise<Policy | null>;
    remove(id: number): Promise<"Policy Does Not Exists" | "Policy Deleted Successfully">;
}
