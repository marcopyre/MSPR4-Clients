import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user when given a valid email', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.email = 'test@example.com';
      mockUser.password = await bcrypt.hash('password', 10);
      mockUser.isAdmin = false;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await service.findOne('test@example.com');

      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should return undefined when given an invalid email', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      const result = await service.findOne('invalid@example.com');

      expect(result).toBeUndefined();
      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: 'invalid@example.com',
      });
    });
  });

  describe('create', () => {
    it('should create a new user and return the email', async () => {
      const dto: UserDto = {
        username: 'test@example.com',
        password: 'password',
      };
      const hash = 'iamahash';
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.email = dto.username;
      mockUser.password = hash;
      mockUser.isAdmin = false;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash as never);
      jest.spyOn(repository, 'create').mockReturnValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(result).toEqual({ email: dto.username });
      expect(repository.create).toHaveBeenCalledWith({
        email: dto.username,
        password: hash,
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
