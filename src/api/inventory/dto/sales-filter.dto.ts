import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PLATFORM, PRODUCT_CATEGORY } from 'src/constants/product.enum';

export class SalesFilterDto {
  @ApiPropertyOptional({ description: 'Start date for filtering sales' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering sales' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Product ID to filter by' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ enum: PRODUCT_CATEGORY, description: 'Product category to filter by' })
  @IsOptional()
  @IsEnum(PRODUCT_CATEGORY)
  category?: PRODUCT_CATEGORY;

  @ApiPropertyOptional({ enum: PLATFORM, description: 'Platform to filter by' })
  @IsOptional()
  @IsEnum(PLATFORM)
  platform?: PLATFORM;
}
