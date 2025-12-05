import { PlansService } from './plans.service';
import { CustomLoggerService } from 'src/common/logger';
export declare class PlansController {
    private readonly plansService;
    private readonly logger;
    constructor(plansService: PlansService, logger: CustomLoggerService);
    findAll(): Promise<import("./entities/plans.entity").Plan[]>;
    findOne(id: string): Promise<import("./entities/plans.entity").Plan>;
    create(createPlanDto: any): Promise<import("./entities/plans.entity").Plan>;
}
