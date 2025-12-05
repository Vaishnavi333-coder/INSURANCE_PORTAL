import { CreateClaimDto } from './create-claim.dto';
import { ClaimStatus } from '../entities/claim.entity';
declare const UpdateClaimDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateClaimDto>>;
export declare class UpdateClaimDto extends UpdateClaimDto_base {
    status?: ClaimStatus;
    rejectionReason?: string;
}
export {};
