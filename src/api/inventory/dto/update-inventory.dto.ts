import { IsUUID, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { INVENTORY_CHANGE_TYPE } from 'src/constants/inventory.enum';

export class UpdateInventoryDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity change (positive for increase, negative for decrease)' })
  @IsNumber()
  quantityChange: number;

  @ApiProperty({ enum: INVENTORY_CHANGE_TYPE, description: 'Type of inventory change' })
  @IsEnum(INVENTORY_CHANGE_TYPE)
  changeType: INVENTORY_CHANGE_TYPE;

  @ApiPropertyOptional({ description: 'Reason for inventory change' })
  @IsOptional()
  @IsString()
  reason?: string;
}