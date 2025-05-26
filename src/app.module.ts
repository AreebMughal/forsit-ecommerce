import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // Makes ConfigModule available across your application
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig
    })
  ]
})
export class AppModule {}
