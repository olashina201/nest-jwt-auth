/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.schema';
const users = require('../user.json');
import { AuthDto, CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {}

  signinLocal(dto: AuthDto) {
    // retrieve user
    const user = users.find((_user: { email: string; }) => _user.email === dto.email);
    if (!user) throw new UnauthorizedException('User does not exist');
    if (user.password !== dto.password)
      throw new UnauthorizedException('email or password not correct');
    return this.signUser(user.id, user.email, 'user');
  }

  signupLocal(dto: CreateUserDto): Promise<User> {
    const { email } = dto;
    const createUser = new this.userModel(dto);
    return createUser.save()
  }

  signUser(userId: number, email: string, type: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
      claim: type,
    });
  }

  async fetchUsers(): Promise<User[]> {
    return this.userModel.find({});
  }
}
