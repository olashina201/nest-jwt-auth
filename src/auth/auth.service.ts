/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.schema';
import * as bcrypt from 'bcryptjs';
const users = require('../user.json');
import { AuthDto, CreateUserDto } from './dto';
import { SALT_OR_ROUNDS } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signinLocal(dto: AuthDto) {
    // retrieve user
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user) throw new NotFoundException('User does not exist');
    if (!isMatch)
      throw new UnauthorizedException('email or password not correct');
    return this.signUser(user.id, user.email, 'user');
  }

  async signupLocal(dto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, middleName } = dto;
    const user = await this.userModel.findOne({ email: email });
    if (user)
      throw new ForbiddenException('user with this email already exists');

    const passwordHash = await bcrypt.hash(password, SALT_OR_ROUNDS);
    const createUser = new this.userModel({
      firstName,
      lastName,
      middleName,
      email,
      password: passwordHash,
    });
    return createUser.save();
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
