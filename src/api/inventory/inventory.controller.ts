import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from 'src/entities';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current inventory status for all products' })
  @ApiResponse({ status: 200, description: 'Current inventory retrieved successfully' })
  getCurrentInventory() {
    return this.inventoryService.getCurrentInventory();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock levels' })
  @ApiQuery({ name: 'threshold', required: false, description: 'Low stock threshold (default: 10)' })
  @ApiResponse({ status: 200, description: 'Low stock products retrieved successfully' })
  getLowStockProducts(@Query('threshold') threshold?: string) {
    const thresholdNumber = threshold ? parseInt(threshold) : 10;
    return this.inventoryService.getLowStockProducts(thresholdNumber);
  }

  @Get('value')
  @ApiOperation({ summary: 'Get total inventory value' })
  @ApiResponse({ status: 200, description: 'Inventory value retrieved successfully' })
  getInventoryValue() {
    return this.inventoryService.getInventoryValue();
  }

  @Post('update')
  @ApiOperation({ summary: 'Update inventory levels' })
  @ApiResponse({ status: 201, description: 'Inventory updated successfully', type: Inventory })
  updateInventory(@Body() updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    return this.inventoryService.updateInventory(updateInventoryDto);
  }

  @Get('history/:productId')
  @ApiOperation({ summary: 'Get inventory change history for a product' })
  @ApiResponse({ status: 200, description: 'Inventory history retrieved successfully', type: [Inventory] })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getInventoryHistory(@Param('productId') productId: string): Promise<Inventory[]> {
    return this.inventoryService.getInventoryHistory(productId);
  }
}