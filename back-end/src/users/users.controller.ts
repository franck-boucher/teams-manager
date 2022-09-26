import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { UsersService } from './users.service';
import {
  CreateUserInput,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
} from './users.validation';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAll();
  }

  @Get('available')
  getAvailableUsers() {
    return this.usersService.getAvailableUsersForTeam();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  createUser(@Body() { confirmPassword, ...user }: CreateUserInput) {
    return this.usersService.create(user);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  updateUser(@Body() user: UpdateUserInput) {
    return this.usersService.update(user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
