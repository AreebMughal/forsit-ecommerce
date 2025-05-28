import { IsOptional, IsDateString, IsEnum, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PLATFORM, PRODUCT_CATEGORY } from 'src/constants/product.enum';

export class AnalyticsFilterDto {
  @ApiPropertyOptional({ description: 'Start date for analytics period' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for analytics period' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: PRODUCT_CATEGORY, description: 'Product category to filter by' })
  @IsOptional()
  @IsEnum(PRODUCT_CATEGORY)
  category?: PRODUCT_CATEGORY;

  @ApiPropertyOptional({ enum: PLATFORM, description: 'Platform to filter by' })
  @IsOptional()
  @IsEnum(PLATFORM)
  platform?: PLATFORM;

  @ApiPropertyOptional({ 
    description: 'Grouping period for revenue analysis',
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  })
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}