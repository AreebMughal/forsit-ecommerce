import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Sale } from '../../entities/sale.entity';
import { CreateSalesDto } from './dto/create-sales.dto';
import { SalesFilterDto } from './dto/sales-filter.dto';
import { SalesService } from './sales.service';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale record' })
  @ApiResponse({ status: 201, description: 'Sale created successfully', type: Sale })
  create(@Body() createSaleDto: CreateSalesDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales with optional filters' })
  @ApiResponse({ status: 200, description: 'Sales retrieved successfully', type: [Sale] })
  findAll(@Query() filters: SalesFilterDto): Promise<Sale[]> {
    return this.salesService.findAll(filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get sales summary statistics' })
  @ApiResponse({ status: 200, description: 'Sales summary retrieved successfully' })
  getSummary(@Query() filters: SalesFilterDto) {
    return this.salesService.getSalesSummary(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale retrieved successfully', type: Sale })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }
}