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
} from '@nestjs/common';
import { BookSerivice } from './book.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('book')
export class BookController {
  constructor(private bookSerivce: BookSerivice) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateBookDto, @Req() req) {
    const userId = req.user.userId;
    return this.bookSerivce.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookSerivce.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bookSerivce.remove(id);
  }

  @Get()
  getAllBooks() {
    return this.bookSerivce.findAllBook();
  }

  @Get(':bookId')
  getBook(@Param('bookId') bookId: string) {
    return this.bookSerivce.findBookById(bookId);
  }
}
