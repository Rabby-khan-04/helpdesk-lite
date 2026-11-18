import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorCode } from '../common/error-codes.js';
import { ID_GENERATOR_OPTIONS } from '../id-generator/id-generator.options.js';
import { IdGenerator } from '../id-generator/id-generator.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { updateEmailDto, UpdateUserDto } from './dto/update-user.dto.js';
import { PasswordHasher } from './password-hasher.js';
import { UserFilter, UserRepository } from './user.repository.js';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly ids: IdGenerator,
  ) {}

  async findAll(filters: UserFilter) {
    return await this.userRepo.findAll(filters);
  }

  async findOne(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} not found`, {
        errorCode: 'BATPAR_INCOMING',
      });

    return user;
  }

  async create(dto: CreateUserDto) {
    const exist = await this.userRepo.findByEmail(dto.email);

    if (exist)
      throw new ConflictException(
        `User with email: ${dto.email} already exists`,
        { errorCode: ErrorCode.EmailTaken },
      );

    return this.userRepo.create({
      id: this.ids.generate(),
      name: dto.name,
      gender: dto.gender,
      age: dto.age,
      email: dto.email,
      password: await this.hasher.hash(dto.password),
      photo: dto.photo ?? '',
      role: 'user',
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    return this.userRepo.update(id, dto);
  }

  async updateEmail(id: string, emailDto: updateEmailDto) {
    const user = await this.findOne(id);

    if (user.email !== emailDto.oldEmail)
      throw new UnauthorizedException('Unauthorized Access!!');

    return this.userRepo.updateEmail(id, emailDto);
  }
}
