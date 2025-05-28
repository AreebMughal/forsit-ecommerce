import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory, Product } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Product])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
