import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      user: { id },
      category: { id: +createTransactionDto.category },
    };
    if (!newTransaction) throw new BadRequestException('Something went wrong');
    return await this.transactionRepository.save(newTransaction);
  }
  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      order: { createdAt: 'DESC' },
    });
    return transactions;
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: { user: true, category: true },
    });
    console.log(id, 'id');
    if (!transaction) throw new BadRequestException('Dont find a transaction');
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    console.log(id, 'id');
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) throw new BadRequestException('Dont find a transaction');
    return await this.transactionRepository.update(id, updateTransactionDto);
  }

  async remove(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) throw new BadRequestException('Dont find a transaction');
    return await this.transactionRepository.delete(id);
  }
  async findAllWithPagination(id: number, page: number, limit: number) {
    const transactions = await this.transactionRepository.find({
      where: { id },
      relations: { category: true, user: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return transactions;
  }

  async findAllByType(id: number, type: string) {
    const transactions = await this.transactionRepository.find({
      where: { user: { id }, type },
    });
    const total = transactions.reduce((acc, item) => acc + item.amount, 0);
    return total;
  }
}
