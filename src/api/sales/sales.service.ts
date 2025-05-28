import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../../entities/sale.entity';
import { Product } from '../../entities/product.entity';
import { SalesFilterDto } from './dto/sales-filter.dto';
import { CreateSalesDto } from './dto/create-sales.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createSaleDto: CreateSalesDto): Promise<Sale> {
    const product = await this.productRepository.findOne({
      where: { id: createSaleDto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${createSaleDto.productId} not found`);
    }

    const totalRevenue = createSaleDto.quantity * createSaleDto.unitPrice;
    const totalCost = product.cost ? createSaleDto.quantity * product.cost : null;

    const sale = this.saleRepository.create({
      ...createSaleDto,
      totalRevenue,
      totalCost,
      saleDate: new Date(createSaleDto.saleDate),
    });

    return await this.saleRepository.save(sale);
  }

  async findAll(filters: SalesFilterDto): Promise<Sale[]> {
    const query = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.product', 'product');

    if (filters.startDate && filters.endDate) {
      query.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters.productId) {
      query.andWhere('sale.productId = :productId', { productId: filters.productId });
    }

    if (filters.category) {
      query.andWhere('product.category = :category', { category: filters.category });
    }

    if (filters.platform) {
      query.andWhere('sale.platform = :platform', { platform: filters.platform });
    }

    return await query.orderBy('sale.saleDate', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async getSalesSummary(filters: SalesFilterDto) {
    const query = this.saleRepository.createQueryBuilder('sale')
      .leftJoin('sale.product', 'product');

    if (filters.startDate && filters.endDate) {
      query.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters.category) {
      query.andWhere('product.category = :category', { category: filters.category });
    }

    if (filters.platform) {
      query.andWhere('sale.platform = :platform', { platform: filters.platform });
    }

    const result = await query
      .select([
        'COUNT(sale.id) as totalSales',
        'SUM(sale.quantity) as totalQuantity',
        'SUM(sale.totalRevenue) as totalRevenue',
        'SUM(sale.totalCost) as totalCost',
        'AVG(sale.unitPrice) as averagePrice',
      ])
      .getRawOne();

    return {
      totalSales: parseInt(result.totalSales) || 0,
      totalQuantity: parseInt(result.totalQuantity) || 0,
      totalRevenue: parseFloat(result.totalRevenue) || 0,
      totalCost: parseFloat(result.totalCost) || 0,
      averagePrice: parseFloat(result.averagePrice) || 0,
      profit: (parseFloat(result.totalRevenue) || 0) - (parseFloat(result.totalCost) || 0),
    };
  }
}