import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async create(dto: UserDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const product = this.userRepository.create({
      email: dto.username,
      password: hash,
    });
    await this.userRepository.save(product);
    return { email: dto.username };
  }
}
