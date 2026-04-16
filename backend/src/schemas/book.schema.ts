import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ type: [String], defualt: [] })
  categories: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop()
  publishedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
