import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterDto } from './dto/analytics-filters.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue-trends')
  @ApiOperation({ summary: 'Get revenue trends by period (daily, weekly, monthly, yearly)' })
  @ApiResponse({ status: 200, description: 'Revenue trends retrieved successfully' })
  getRevenueTrends(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getRevenueTrends(filters);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top performing products by revenue' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of top products to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Top products retrieved successfully' })
  getTopProducts(
    @Query() filters: AnalyticsFilterDto,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit) : 10;
    return this.analyticsService.getTopProducts(filters, limitNumber);
  }

  @Get('category-summary')
  @ApiOperation({ summary: 'Get sales summary by product category' })
  @ApiResponse({ status: 200, description: 'Category summary retrieved successfully' })
  getCategorySummary(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getCategorySummary(filters);
  }

  @Get('platform-comparison')
  @ApiOperation({ summary: 'Compare performance across different platforms' })
  @ApiResponse({ status: 200, description: 'Platform comparison retrieved successfully' })
  getPlatformComparison(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getPlatformComparison(filters);
  }

  @Get('performance-metrics')
  @ApiOperation({ summary: 'Get performance metrics with period-over-period comparison' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  getPerformanceMetrics(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getPerformanceMetrics(filters);
  }
}