import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CustomLoggerService } from 'src/common/logger';
export declare class UsersService {
    private userRepository;
    private logger;
    constructor(userRepository: Repository<User>, logger: CustomLoggerService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User | null>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithPassword(email: string): Promise<User | null>;
}
