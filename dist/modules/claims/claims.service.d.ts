import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Policy } from 'src/modules/policies/entities/policy.entity';
import { CustomLoggerService } from 'src/common/logger';
export declare class ClaimsService {
    private claimRepository;
    private userRepository;
    private policyRepository;
    private logger;
    constructor(claimRepository: Repository<Claim>, userRepository: Repository<User>, policyRepository: Repository<Policy>, logger: CustomLoggerService);
    create(createClaimDto: CreateClaimDto, userId: number): Promise<Claim>;
    findAll(userId: number): Promise<{
        claimAmt: number;
        claimId: number;
        userId: number;
        claimAmount: number;
        description: string;
        status: import("./entities/claim.entity").ClaimStatus;
        rejectionReason: string | null;
        submittedAt: Date;
        policy: Policy;
        deleted: boolean;
    }[]>;
    findOne(id: number): Promise<Claim>;
    findAllClaims(): Promise<{
        claimAmt: number;
        user: {
            id: number;
            email: string;
            name: string;
        } | null;
        claimId: number;
        userId: number;
        claimAmount: number;
        description: string;
        status: import("./entities/claim.entity").ClaimStatus;
        rejectionReason: string | null;
        submittedAt: Date;
        policy: Policy;
        deleted: boolean;
    }[]>;
    findAllClaimsPaginated(offset?: number, limit?: number): Promise<{
        data: {
            claimAmt: number;
            user: {
                id: number;
                email: string;
                name: string;
            } | null;
            claimId: number;
            userId: number;
            claimAmount: number;
            description: string;
            status: import("./entities/claim.entity").ClaimStatus;
            rejectionReason: string | null;
            submittedAt: Date;
            policy: Policy;
            deleted: boolean;
        }[];
        pagination: {
            total: number;
            offset: number;
            limit: number;
            hasMore: boolean;
        };
    }>;
    update(id: number, updateClaimDto: UpdateClaimDto): Promise<Claim | null>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
