import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PLATFORM, PRODUCT_CATEGORY } from 'src/constants/product.enum';

export class CreateProductDto {
  @ApiProperty({ description: 'Product SKU (unique identifier)' })
  @IsString()
  sku: string;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PRODUCT_CATEGORY, description: 'Product category' })
  @IsEnum(PRODUCT_CATEGORY)
  category: PRODUCT_CATEGORY;

  @ApiProperty({ description: 'Product price', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ description: 'Product cost', minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  cost?: number;

  @ApiProperty({ enum: PLATFORM, description: 'Sales platform' })
  @IsEnum(PLATFORM)
  platform: PLATFORM;

  @ApiPropertyOptional({ description: 'Whether product is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
