import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from 'src/common/logger';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: CustomLoggerService
  ) {}

  //create a new user
  async create(createUserDto: CreateUserDto) {

    //check if user already exists
    this.logger.log(`Request received for user registration with email : ${createUserDto.email}`);
    const user = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (user) {
      this.logger.error(`User already registered with email : ${createUserDto.email}`);
      throw new ConflictException('User already exists');
    }
    
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  //get all users
  async findAll() {
    this.logger.log(`Fetching all users`);
    const users = await this.userRepository.find();
    if(!users) {
      this.logger.warn(`No users found`);
      throw new NotFoundException('No users found');
    }
    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  //get a user by id
  async findOne(id: number) {
    this.logger.log(`Fetching user with id: ${id}`);
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if(!user) {
      this.logger.warn(`User ${id} not found`);
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //update a user
  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id: ${id}`);
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if(!user) {
      this.logger.error(`User update failed: User ${id} not found`);
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(id, updateUserDto);
    this.logger.log(`User ${id} updated successfully`);
    return await this.userRepository.findOne({ where: { userId: id } });
  }

  //delete a user
  async remove(id: number) {
    this.logger.log(`Deleting user with id: ${id}`);
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if(!user) {
      this.logger.error(`User deletion failed: User ${id} not found`);
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
    this.logger.log(`User ${id} deleted successfully`);
    return { message: 'User deleted successfully' };
  }

  //find a user by email (includes passwordHash for authentication)
  // async findByEmail(email: string) {
  //   return await this.userRepository
  //     .createQueryBuilder('user')
  //     .addSelect('user.passwordHash')
  //     .where('user.email = :email', { email })
  //     .getOne();
  // }

  //function to find a user by email (returns null if not found)
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  //function to find a user by email with passwordHash for authentication (returns null if not found)
  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({ 
      where: { email }, 
      select: ['userId', 'email', 'passwordHash', 'role'] 
    });
  }
}
