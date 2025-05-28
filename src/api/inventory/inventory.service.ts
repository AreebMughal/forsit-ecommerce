import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from 'src/entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getCurrentInventory(): Promise<any[]> {
    const query = `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.category,
        p.platform,
        COALESCE(
          (SELECT quantity_after 
           FROM inventory 
           WHERE product_id = p.id 
           ORDER BY change_date DESC 
           LIMIT 1), 0
        ) as current_quantity,
        CASE 
          WHEN COALESCE(
            (SELECT quantity_after 
             FROM inventory 
             WHERE product_id = p.id 
             ORDER BY change_date DESC 
             LIMIT 1), 0
          ) <= 10 THEN true 
          ELSE false 
        END as low_stock_alert
      FROM products p
      WHERE p.is_active = true
      ORDER BY p.name
    `;

    return await this.inventoryRepository.query(query);
  }

  async updateInventory(updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    const product = await this.productRepository.findOne({
      where: { id: updateInventoryDto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${updateInventoryDto.productId} not found`);
    }

    // Get current quantity
    const currentInventory = await this.inventoryRepository.findOne({
      where: { productId: updateInventoryDto.productId },
      order: { changeDate: 'DESC' },
    });

    const quantityBefore = currentInventory ? currentInventory.quantityAfter : 0;
    const quantityAfter = quantityBefore + updateInventoryDto.quantityChange;

    if (quantityAfter < 0) {
      throw new BadRequestException('Insufficient inventory quantity');
    }

    const inventory = this.inventoryRepository.create({
      productId: updateInventoryDto.productId,
      quantityBefore,
      quantityChange: updateInventoryDto.quantityChange,
      quantityAfter,
      changeType: updateInventoryDto.changeType,
      reason: updateInventoryDto.reason,
      changeDate: new Date(),
    });

    return await this.inventoryRepository.save(inventory);
  }

  async getInventoryHistory(productId: string): Promise<Inventory[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return await this.inventoryRepository.find({
      where: { productId },
      relations: ['product'],
      order: { changeDate: 'DESC' },
    });
  }

  async getLowStockProducts(threshold: number = 10): Promise<any[]> {
    const query = `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.category,
        p.platform,
        COALESCE(
          (SELECT quantity_after 
           FROM inventory 
           WHERE product_id = p.id 
           ORDER BY change_date DESC 
           LIMIT 1), 0
        ) as current_quantity
      FROM products p
      WHERE p.is_active = true
      AND COALESCE(
        (SELECT quantity_after 
         FROM inventory 
         WHERE product_id = p.id 
         ORDER BY change_date DESC 
         LIMIT 1), 0
      ) <= $1
      ORDER BY 
        COALESCE(
          (SELECT quantity_after 
           FROM inventory 
           WHERE product_id = p.id 
           ORDER BY change_date DESC 
           LIMIT 1), 0
        ) ASC
    `;

    return await this.inventoryRepository.query(query, [threshold]);
  }

  async getInventoryValue(): Promise<any> {
    const query = `
      SELECT 
        SUM(
          COALESCE(
            (SELECT quantity_after 
             FROM inventory 
             WHERE product_id = p.id 
             ORDER BY change_date DESC 
             LIMIT 1), 0
          ) * COALESCE(p.cost, p.price)
        ) as total_inventory_value,
        COUNT(p.id) as total_products,
        SUM(
          COALESCE(
            (SELECT quantity_after 
             FROM inventory 
             WHERE product_id = p.id 
             ORDER BY change_date DESC 
             LIMIT 1), 0
          )
        ) as total_quantity
      FROM products p
      WHERE p.is_active = true
    `;

    const result = await this.inventoryRepository.query(query);
    return {
      totalInventoryValue: parseFloat(result[0].total_inventory_value) || 0,
      totalProducts: parseInt(result[0].total_products) || 0,
      totalQuantity: parseInt(result[0].total_quantity) || 0,
    };
  }
}
