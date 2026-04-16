import { Injectable, NotFoundException, Search } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookSerivice {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>,
  ) {}

  async findAllBook(page = 1, limit = 10, search?: string) {
    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const books = await this.bookModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.bookModel.countDocuments(query);

    return {
      data: books,
      total,
      page,
      limit,
    };
  }

  async findBookById(_id: string): Promise<Book | null> {
    const book = this.bookModel.findById(_id);

    if (!book) throw new NotFoundException('Book not found');

    (await book).viewCount += 1;
    (await book).save();

    return book;
  }

  async create(createBookDto: CreateBookDto, userId: string) {
    const book = new this.bookModel({
      ...createBookDto,
      createdBy: userId,
    });

    return book.save();
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, {
      new: true,
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async remove(id: string) {
    const book = await this.bookModel.findByIdAndDelete(id);

    if (!book) {
      throw new NotFoundException('Book not Found');
    }

    return { message: 'Book deleted successfully' };
  }
}
