import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException, Query } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { ClaimStatus } from './entities/claim.entity';
import { CustomLoggerService } from 'src/common/logger';

@ApiTags('Claims')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('claims')
export class ClaimsController {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly logger: CustomLoggerService,
  ) { }


  //create a new claim, only users can create claims
  @Post()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 201, description: 'Claim created successfully' })
  async create(@Req() req: any, @Body() createClaimDto: CreateClaimDto) {
    const userId = req.user.userId;
    this.logger.log(`User ${userId} creating new claim for policy ${createClaimDto.policyId}`);
    return await this.claimsService.create(createClaimDto, userId);
  }

  //get all claims of a user by userId, can be done by the user or an admin
  @Get()
  @ApiResponse({ status: 200, description: 'Claims fetched successfully' })
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    this.logger.log(`Fetching all claims for userId: ${userId}`);
    return await this.claimsService.findAll(userId);
  }

  //get list of all claims of all users, only admins can get all claims (alias route)
  //supports pagination with offset and limit query params
  @Get('admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of records to skip' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to return (default 30)' })
  @ApiResponse({ status: 200, description: 'All claims fetched successfully (admin)' })
  async findAllClaimsAdmin(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const limitNum = limit ? parseInt(limit, 10) : 30; // Default 30 per batch
    this.logger.log(`Admin fetching claims: offset=${offsetNum}, limit=${limitNum}`);
    return await this.claimsService.findAllClaimsPaginated(offsetNum, limitNum);
  }

  //get list of all claims of all users, only admins can get all claims
  @Get('all')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 200, description: 'All claims fetched successfully' })
  async findAllClaims() {
    return await this.claimsService.findAllClaims();
  }

  //admin update claim status only
  @Patch('admin/:id/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 200, description: 'Claim status updated successfully' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: ClaimStatus; rejectionReason?: string }) {
    this.logger.log(`Admin updating claim ${id} status to ${body.status}${body.rejectionReason ? ' with reason: ' + body.rejectionReason : ''}`);
    return await this.claimsService.update(+id, { 
      status: body.status,
      rejectionReason: body.rejectionReason || undefined
    });
  }

  //get a claim by id, only authenticated users can get their own claims
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Claim fetched successfully' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    this.logger.log(`Fetching claim ${id} for userId: ${userId}`);
    const claim = await this.claimsService.findOne(+id);
    if (claim.userId !== userId && req.user.role !== UserRole.ADMIN) { 
      this.logger.warn(`Access denied: User ${userId} attempted to access claim ${id} owned by another user`);
      throw new ForbiddenException('You cannot access this claim');
    }
    return claim;
  }

  //updating a claim, only authenticated users can update their own claims
  //admins can also update any claim
  //but issue is admin can only change the status of the claim, not the other fields
  //we will implement this in the future, 
  //solution we will create one more endpoint, updateStatus of claim, and it will be done only by admins
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Claim updated successfully' })
  async update(@Req() req: any, @Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    const userId = req.user.userId;
    const claim = await this.claimsService.findOne(+id);
    if (claim.userId !== userId && req.user.role !== UserRole.ADMIN) { 
      //if the user is not the owner of the claim and not an admin, throw an error because they are trying to update a claim that is not theirs
      throw new ForbiddenException('You cannot update this claim');
    }
    this.logger.log(`User ${userId} updating claim ${id}`);
    return await this.claimsService.update(+id, updateClaimDto);
  }

  //deleting a claim, only authenticated users can delete their own claims
  //admins can't delete claims
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiResponse({ status: 200, description: 'Claim deleted successfully' })
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    this.logger.log(`User ${userId} requesting to delete claim ${id}`);
    const claim = await this.claimsService.findOne(+id);
    if (claim.userId !== userId) { 
      this.logger.warn(`Delete denied: User ${userId} attempted to delete claim ${id} owned by another user`);
      throw new ForbiddenException('You cannot delete this claim');
    }
    return await this.claimsService.remove(+id);
  }
}
