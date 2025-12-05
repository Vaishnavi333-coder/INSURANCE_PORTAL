import { Policy } from "src/modules/policies/entities/policy.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Plan {
    @PrimaryGeneratedColumn()
    planId: number;

    @Column({ type: 'varchar2', length: 100 })
    name: string;

    @Column({ type: 'varchar2', length: 250 })
    description: string;

    @Column({ type: 'varchar2', length: 100 })
    insurer: string;

    @Column({ type: 'number', precision: 10, scale: 2, default: 0 })
    premiumAmount: number;

    @Column({ type: 'number', precision: 10, scale: 2, default: 0 })
    coverageAmount: number;

    @Column({ type: 'varchar2', length: 100 })
    category: string;

    @OneToMany(() => Policy, (policy) => policy.plan)
    policies: Policy[];
}