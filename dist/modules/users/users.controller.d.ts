import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomLoggerService } from 'src/common/logger';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService, logger: CustomLoggerService);
    findAllAdmin(): Promise<import("./entities/user.entity").User[]>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(req: any, id: string): Promise<import("./entities/user.entity").User>;
    update(req: any, id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User | null>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
