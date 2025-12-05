import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { ClaimStatus } from './entities/claim.entity';
import { CustomLoggerService } from 'src/common/logger';
export declare class ClaimsController {
    private readonly claimsService;
    private readonly logger;
    constructor(claimsService: ClaimsService, logger: CustomLoggerService);
    create(req: any, createClaimDto: CreateClaimDto): Promise<import("./entities/claim.entity").Claim>;
    findAll(req: any): Promise<{
        claimAmt: number;
        claimId: number;
        userId: number;
        claimAmount: number;
        description: string;
        status: ClaimStatus;
        rejectionReason: string | null;
        submittedAt: Date;
        policy: import("../policies/entities/policy.entity").Policy;
        deleted: boolean;
    }[]>;
    findAllClaimsAdmin(offset?: string, limit?: string): Promise<{
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
            status: ClaimStatus;
            rejectionReason: string | null;
            submittedAt: Date;
            policy: import("../policies/entities/policy.entity").Policy;
            deleted: boolean;
        }[];
        pagination: {
            total: number;
            offset: number;
            limit: number;
            hasMore: boolean;
        };
    }>;
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
        status: ClaimStatus;
        rejectionReason: string | null;
        submittedAt: Date;
        policy: import("../policies/entities/policy.entity").Policy;
        deleted: boolean;
    }[]>;
    updateStatus(id: string, body: {
        status: ClaimStatus;
        rejectionReason?: string;
    }): Promise<import("./entities/claim.entity").Claim | null>;
    findOne(req: any, id: string): Promise<import("./entities/claim.entity").Claim>;
    update(req: any, id: string, updateClaimDto: UpdateClaimDto): Promise<import("./entities/claim.entity").Claim | null>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
