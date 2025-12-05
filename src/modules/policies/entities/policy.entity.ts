import { Claim } from "src/modules/claims/entities/claim.entity";
import { Plan } from "src/modules/plans/entities/plans.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum PolicyType {
    HOME = 'home',
    MOTOR = 'motor',
    TRAVEL = 'travel',
    HEALTH = 'health',
    ACCIDENT = 'accident',
    OTHER = 'other',
    LIFE = 'life'
}

export enum PolicyStatus {
    LAPSED = 'lapsed',
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

@Entity()
export class Policy {

    @PrimaryGeneratedColumn({ type: 'number' })     // Oracle uses NUMBER, not BIGINT
    policyId: number;

    @Column({ type: 'number' })                     // Oracle uses NUMBER for bigint equivalent
    userId: number;
    

    // @Column({ type: 'varchar2', length: 100 })      // Oracle uses VARCHAR2, not VARCHAR
    // insurer: string;

    @ManyToOne(() => Plan, (plan) => plan.policies)
    @JoinColumn({ name: 'planId' })
    plan: Plan; 

    @Column({
        type: 'varchar2',
        length: 50,
        enum: PolicyType,
    })
    policyType: PolicyType;

    @Column({ type: 'number', precision: 10, scale: 2 })  // Oracle decimal → NUMBER(p,s)
    premiumAmount: number;

    @Column({
        type: 'timestamp', 
        default: () => "CURRENT_TIMESTAMP"          
    })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @Column({ type: 'varchar2', length: 20, enum : PolicyStatus, default: PolicyStatus.LAPSED })
    status: PolicyStatus;

    // Auto-generated timestamp when policy is created (purchase time with full timestamp)
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // Auto-updated timestamp when policy is modified (status change, etc.)
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.policies)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Claim, (claim) => claim.policy)
    claims: Claim[];

    @Column({default : false})
    deleted : boolean

}
