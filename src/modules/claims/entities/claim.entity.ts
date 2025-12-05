import { Policy } from "src/modules/policies/entities/policy.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

export enum ClaimStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    IN_REVIEW = 'in_review',
}

@Entity('claims')
export class Claim {


    @PrimaryGeneratedColumn({ type: 'number' })
    claimId: number;

    // @Column({ type: 'number' })
    // policyId: number;

    @Column({ type: 'number' })
    userId: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    claimAmount: number;

    @Column({ type: 'varchar', length: 200 })
    description: string;

    //@Column({ type: 'enum', enum: ClaimStatus, default: ClaimStatus.PENDING })
    //above line does not works because enum is not a valid datatype in oracle databse
    @Column({ type: 'varchar', length: 20, default: ClaimStatus.PENDING })
    status: ClaimStatus;
    
    // Rejection reason - nullable, only filled when status is REJECTED
    @Column({ type: 'varchar', length: 500, nullable: true })
    rejectionReason: string | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submittedAt: Date;

    @ManyToOne(() => Policy, (policy) => policy.claims)
    @JoinColumn({ name: 'policyId' })
    policy: Policy;

    @Column({default : false})
    deleted : boolean
}
