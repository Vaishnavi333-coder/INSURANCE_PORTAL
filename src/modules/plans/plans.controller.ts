import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { CustomLoggerService } from 'src/common/logger';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(
    private readonly plansService: PlansService,
    private readonly logger: CustomLoggerService,
  ) {}

  // Get all plans (public endpoint for users to browse)
  @Get()
  @ApiResponse({ status: 200, description: 'Plans fetched successfully' })
  findAll() {
    this.logger.log('Fetching all available plans');
    return this.plansService.findAll();
  }

  // Get a plan by id
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Plan fetched successfully' })
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(+id);
  }

  // Create a new plan (admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  create(@Body() createPlanDto: any) {
    this.logger.log('Admin creating new plan');
    return this.plansService.create(createPlanDto);
  }
}

