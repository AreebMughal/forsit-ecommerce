import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { PLATFORM } from 'src/constants/product.enum';

@Entity('sales')
@Index(['saleDate'])
@Index(['productId'])
@Index(['platform'])
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'product_id' })
  productId: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_revenue' })
  totalRevenue: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, name: 'total_cost' })
  totalCost: number;

  @Column({
    type: 'enum',
    enum: PLATFORM
  })
  platform: PLATFORM;

  @Column('timestamp', { name: 'sale_date' })
  saleDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.sales)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
