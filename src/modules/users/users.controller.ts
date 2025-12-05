import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { CustomLoggerService } from 'src/common/logger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}


  //get list of all users (admin route alias)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  @ApiResponse({ status: 200, description: 'All users fetched successfully (admin)' })
  findAllAdmin() {
    this.logger.log(`Admin fetching all users`);
    return this.usersService.findAll();
  }

  //get list of all users
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  findAll() {
    this.logger.log(`Fetching all users`);
    return this.usersService.findAll();
  }

  //fetch details of a user by id
  @Get(':id')
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    this.logger.log(`Fetching user ${id} for userId: ${userId}`);
    const user = await this.usersService.findOne(+id);
    if(user.userId !== userId && req.user.role !== UserRole.ADMIN) {
      this.logger.warn(`Access denied: User ${userId} attempted to access user ${id}`);
      throw new ForbiddenException('You cannot access this user');
    }
    return user;
  }

  //update user details, only authenticated users can update their own details
  //even admins can update other users details
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async update(@Req() req: any, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    this.logger.log(`User ${userId} updating user ${id}`);
    const user = await this.usersService.findOne(+id);
    if(user.userId !== userId && req.user.role !== UserRole.ADMIN) {
      this.logger.warn(`Update denied: User ${userId} attempted to update user ${id}`);
      throw new ForbiddenException('You cannot update this user');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  //delete a user, only authenticated users can delete their own details
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    this.logger.log(`User ${userId} requesting to delete user ${id}`);
    const user = await this.usersService.findOne(+id);
    if(user.userId !== userId) {
      this.logger.warn(`Delete denied: User ${userId} attempted to delete user ${id}`);
      throw new ForbiddenException('You cannot delete this user');
    }
    return this.usersService.remove(+id);
  }
}


