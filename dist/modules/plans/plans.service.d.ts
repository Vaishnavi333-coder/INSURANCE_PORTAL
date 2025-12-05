import { Repository } from 'typeorm';
import { Plan } from './entities/plans.entity';
import { CustomLoggerService } from 'src/common/logger';
export declare class PlansService {
    private planRepository;
    private logger;
    constructor(planRepository: Repository<Plan>, logger: CustomLoggerService);
    findAll(): Promise<Plan[]>;
    findOne(id: number): Promise<Plan>;
    create(createPlanDto: Partial<Plan>): Promise<Plan>;
}
