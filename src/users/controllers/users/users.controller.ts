import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserDto } from '../../dtos/CreateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findUsers();
  }

  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    const { confirmPassword, ...userDetails } = createUser;
    console.log(confirmPassword);
    return this.usersService.createUser(userDetails);
  }
  @Put(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDetails: UpdateUserDto,
  ) {
    this.usersService.updateUser(id, userDetails);
  }

  @Delete('id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/profile')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateUserProfileDto,
  ) {
    return this.usersService.createUserProfile(id, profile);
  }

  @Post(':id/post')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: CreateUserPostDto,
  ) {
    return this.usersService.createUserPost(id, post);
  }
}
