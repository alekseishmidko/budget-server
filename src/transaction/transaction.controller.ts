import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthorGuard } from 'src/guard/author.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get(':type/find')
  @UseGuards(JwtAuthGuard)
  findAllByType(@Req() req, @Param('type') type: string) {
    return this.transactionService.findAllByType(+req.user.id, type);
  }
  // transactions/pagination?page=1&limit=3
  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  findAllWithPagination(
    @Req() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.transactionService.findAllWithPagination(
      +req.user.id,
      +page,
      +limit,
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    return this.transactionService.create(createTransactionDto, +req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.transactionService.findAll(+req.user.id);
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  findOne(@Param('id') id: string) {
    // console.log(id, 'id+');
    return this.transactionService.findOne(+id);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  update(
    @Req() req: any,
    @Param(':id')
    id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    // console.log(id, 'id+', req.params.id);
    return this.transactionService.update(+req.params.id, updateTransactionDto);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
