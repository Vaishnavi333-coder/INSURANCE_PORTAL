import { Policy } from "src/modules/policies/entities/policy.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
export class User {

    @PrimaryGeneratedColumn({ type: 'number' })
    userId: number;

    //{nullable is false by default}
    @Column({ type: 'varchar2', length: 50 })
    name: string;

    @Column({ type: 'varchar2', length: 75, unique : true })
    email: string;

    //select false means that the password will not be returned in the response of queries unless
    //we explicitly select the password
    @Column({ type: 'varchar2', length: 250, select: false })
    passwordHash: string;

    @Column({ type: 'varchar2', length: 10, default: UserRole.USER })
    role: UserRole;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    //we need one more column isActive to track if the user is active or not

    //on column to store refresh tokens
    //refresh tokens are used to refresh the access tokens
    //refresh tokens are stored in the database and are used to refresh the access tokens
    //refresh tokens are used to refresh the access tokens
    @Column({ type: 'varchar2', length: 250, nullable: true })
    refreshToken: string | null;

    //one column to store the last login date
    //last login date is the date and time when the user last logged in
    //last login date is used to track the last login date of the user
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastActivity: Date | null;

    @OneToMany(() => Policy, (policy) => policy.user)
    policies: Policy[];
}
