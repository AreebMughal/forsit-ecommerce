import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { INVENTORY_CHANGE_TYPE } from 'src/constants/inventory.enum';

@Entity('inventory')
@Index(['productId'])
@Index(['changeDate'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'product_id' })
  productId: string;

  @Column('int', { name: 'quantity_before' })
  quantityBefore: number;

  @Column('int', { name: 'quantity_change' })
  quantityChange: number;

  @Column('int', { name: 'quantity_after' })
  quantityAfter: number;

  @Column({
    type: 'enum',
    enum: INVENTORY_CHANGE_TYPE,
    name: 'change_type'
  })
  changeType: INVENTORY_CHANGE_TYPE;

  @Column({ nullable: true })
  reason: string;

  @Column('timestamp', { name: 'change_date' })
  changeDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.inventoryRecords)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
