import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { BookSerivice } from './book.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('books')
export class BookController {
  constructor(private bookService: BookSerivice) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 }, // PDF
        { name: 'coverImage', maxCount: 1 }, // IMAGE
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'file') {
              cb(null, './uploads/pdf');
            } else {
              cb(null, './uploads/images');
            }
          },
          filename: (req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${unique}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'file') {
            if (file.mimetype !== 'application/pdf') {
              return cb(new BadRequestException('PDF only'), false);
            }
          }

          if (file.fieldname === 'coverImage') {
            const allowed = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowed.includes(file.mimetype)) {
              return cb(new BadRequestException('Invalid image'), false);
            }
          }

          cb(null, true);
        },
      },
    ),
  )
  async createWithUpload(
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
    @Body() body: CreateBookDto,
    @Req() req,
  ) {
    const pdf = files.file?.[0];
    const image = files.coverImage?.[0];

    if (!pdf) {
      throw new BadRequestException('PDF is required');
    }

    const fileUrl = `/uploads/pdf/${pdf.filename}`;
    const coverImage = image ? `/uploads/images/${image.filename}` : '';

    return this.bookService.create(
      {
        ...body,
        fileUrl,
        coverImage,
      },
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.bookService.findAllBook(Number(page), Number(limit), search);
  }

  @Get(':bookId')
  getBook(@Param('bookId') bookId: string) {
    return this.bookService.findBookById(bookId);
  }
}
