import { PLATFORM, PRODUCT_CATEGORY } from 'src/constants/product.enum';
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Sale } from './sale.entity';

@Entity('products')
@Index(['category'])
@Index(['platform'])
@Index(['sku'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PRODUCT_CATEGORY
  })
  category: PRODUCT_CATEGORY;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({
    type: 'enum',
    enum: PLATFORM
  })
  platform: PLATFORM;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales: Sale[];

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventoryRecords: Inventory[];
}
