import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParams,
  CreateUserPostParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}
  findUsers() {
    return this.userRepo.find({ relations: ['profile', 'posts'] });
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepo.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepo.save(newUser);
  }
  updateUser(id: number, userDetails: UpdateUserParams) {
    return this.userRepo.update({ id }, { ...userDetails });
  }
  deleteUser(id: number) {
    return this.userRepo.delete({ id });
  }
  async createUserProfile(id: number, profileDetails: CreateUserProfileParams) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('can not find user', HttpStatus.BAD_REQUEST);
    }
    const newProfile = this.profileRepo.create({ ...profileDetails });
    const savedProfile = await this.profileRepo.save(newProfile);
    user.profile = savedProfile;
    return this.userRepo.save(user);
  }
  async createUserPost(id: number, post: CreateUserPostParams) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('can not find user', HttpStatus.BAD_REQUEST);
    }
    const newPost = this.postRepo.create({ ...post, user });

    return this.postRepo.save(newPost);
  }
}
