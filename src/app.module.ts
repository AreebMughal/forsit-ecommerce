import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/typeorm.config';
import { ProductModule } from './api/product/product.module';
import { SalesModule } from './api/sales/sales.module';
import { InventoryModule } from './api/inventory/inventory.module';
import { AnalyticsModule } from './api/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // Makes ConfigModule available across your application
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig
    }),
    ProductModule,
    SalesModule,
    InventoryModule,
    AnalyticsModule
  ]
})
export class AppModule {}
