import {
    Controller,
    Get,
    Post,
    Body,
    Param,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { UserDto } from './users.dto';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    createUser(@Body() dto: UserDto) {
      return this.usersService.create(dto);
    }
  
    @Get(':id')
    updateUser(
      @Param('id') id: string,
    ) {
      return this.usersService.findOne(id);
    }
  }