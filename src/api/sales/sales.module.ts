import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Sale } from 'src/entities';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product])],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
