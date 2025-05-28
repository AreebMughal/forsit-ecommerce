import { IsUUID, IsNumber, IsEnum, IsDateString, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PLATFORM } from 'src/constants/product.enum';

export class CreateSalesDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity sold', minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ description: 'Unit price at time of sale', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitPrice: number;

  @ApiProperty({ enum: PLATFORM, description: 'Sales platform' })
  @IsEnum(PLATFORM)
  platform: PLATFORM;

  @ApiProperty({ description: 'Date of sale', example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  saleDate: string;
}