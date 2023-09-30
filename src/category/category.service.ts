import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const existCategory = await this.categoryRepository.findBy({
      user: { id },
      title: createCategoryDto.title,
    });
    if (existCategory.length) {
      throw new BadRequestException('this category is already exist!');
    }
    const newCategory = {
      title: createCategoryDto.title,
      user: { id: id },
    };
    return this.categoryRepository.save(newCategory);
  }

  async findAll(id: number) {
    return await this.categoryRepository.find({
      where: { user: { id } },
      relations: {
        transactions: true,
      },
    });
  }

  async findOne(id: number) {
    console.log(id, 'findOne');
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!existingCategory)
      throw new NotFoundException('Category not found findOne');
    return existingCategory;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('category not found!');
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('category not found!');
    return this.categoryRepository.delete(id);
  }
}
