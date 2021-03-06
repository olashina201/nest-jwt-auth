/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  middleName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Date.now()})
  date: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
