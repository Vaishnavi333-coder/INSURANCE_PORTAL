import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { CustomLoggerService } from 'src/common/logger';

@ApiTags('Policies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('policies')
export class PoliciesController {
  constructor(
    private readonly policiesService: PoliciesService,
    private readonly logger: CustomLoggerService,
  ) {}


  //create a new policy, only users can create policies
  //admins can't buy policy 
  @Post()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 201, description: 'Policy created successfully' })
  async create(@Req() req: any, @Body() createPolicyDto: CreatePolicyDto) {
    const userId = req.user.userId;
    this.logger.log(`User ${userId} creating new policy for plan ${createPolicyDto.planId}`);
    return await this.policiesService.create(createPolicyDto, userId);
  }
  
  //get all policies by user id, only authenticated users can get their own polcies
  //admin can also get all policies of users
  @Get()
  @ApiResponse({ status: 200, description: 'Policies fetched successfully' })
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    this.logger.log(`Fetching all policies for userId: ${userId}`);
    const policies = await this.policiesService.findAll(userId);
     //now we will check if the policies are owned by the user or not or else he is an admin
     if(policies.some(policy => policy.userId !== userId) && req.user.role !== UserRole.ADMIN) {
      this.logger.warn(`Access denied: User ${userId} attempted to access policies owned by another user`);
      throw new ForbiddenException('You cannot access this policy');
     }
     return policies;
  }

  //get list of all policies of all users, only admins can get all policies (alias route)
  @Get('admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 200, description: 'All policies fetched successfully (admin)' })
  async findAllPoliciesAdmin() {
    this.logger.log(`Admin fetching all policies`);
    return await this.policiesService.findAllPolicies();
  }

  //get list of all policies of all users, only admins can get all policies
  @Get('all')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 200, description: 'All policies fetched successfully' })
  async findAllPolicies() {
    return await this.policiesService.findAllPolicies();
  }

  //get a policy by id, only authenticated users can get a policy by id
  //we donot need user id in this case as policyId is itself a unique identifier
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Policy fetched successfully' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    this.logger.log(`Fetching policy ${id} for userId: ${userId}`);
    const policy = await this.policiesService.findOne(+id);

    if(policy.userId !== userId && req.user.role !== UserRole.ADMIN) {
      this.logger.warn(`Access denied: User ${userId} attempted to access policy ${id} owned by another user`);
      throw new ForbiddenException('You cannot access this policy');
    }
    return policy;
  }

  //update a policy, only authenticated users can update a policy
  //admins can't update policies
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Policy updated successfully' })
  async update(@Req() req: any, @Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto) {
    const userId = req.user.userId;
    const policy = await this.policiesService.findOne(+id);
    if(policy.userId !== userId && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You cannot update this policy');
    }
    this.logger.log(`User ${userId} updating policy ${id} with status: ${updatePolicyDto.status || 'unchanged'}`);
    return this.policiesService.update(+id, updatePolicyDto);
  }

  //delete a policy, only authenticated users can delete their own policies
  //admins can't delete policies
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Policy deleted successfully' })
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    this.logger.log(`User ${userId} requesting to delete policy ${id}`);
    const policy = await this.policiesService.findOne(+id);
    if(policy.userId !== userId && req.user.role !== UserRole.ADMIN) {
      this.logger.warn(`Delete denied: User ${userId} attempted to delete policy ${id} owned by another user`);
      throw new ForbiddenException('You cannot delete this policy');
    }
    return this.policiesService.remove(+id);
  }
}
