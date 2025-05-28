import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsFilterDto } from './dto/analytics-filters.dto';
import { Product, Sale } from 'src/entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getRevenueTrends(filters: AnalyticsFilterDto) {
    let dateFormat: string;
    let groupBy: string;

    switch (filters.period) {
      case 'daily':
        dateFormat = 'YYYY-MM-DD';
        groupBy = "DATE(sale_date)";
        break;
      case 'weekly':
        dateFormat = 'YYYY-"W"WW';
        groupBy = "DATE_TRUNC('week', sale_date)";
        break;
      case 'monthly':
        dateFormat = 'YYYY-MM';
        groupBy = "DATE_TRUNC('month', sale_date)";
        break;
      case 'yearly':
        dateFormat = 'YYYY';
        groupBy = "DATE_TRUNC('year', sale_date)";
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
        groupBy = "DATE(sale_date)";
    }

    let query = `
      SELECT 
        TO_CHAR(${groupBy}, '${dateFormat}') as period,
        SUM(total_revenue) as revenue,
        SUM(total_cost) as cost,
        SUM(total_revenue) - SUM(COALESCE(total_cost, 0)) as profit,
        COUNT(*) as total_sales,
        SUM(quantity) as total_quantity
      FROM sales s
      LEFT JOIN products p ON s.product_id = p.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      query += ` AND s.sale_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(filters.startDate, filters.endDate);
      paramIndex += 2;
    }

    if (filters.category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.platform) {
      query += ` AND s.platform = $${paramIndex}`;
      params.push(filters.platform);
      paramIndex++;
    }

    query += ` GROUP BY ${groupBy} ORDER BY ${groupBy}`;

    const results = await this.saleRepository.query(query, params);

    return results.map(row => ({
      period: row.period,
      revenue: parseFloat(row.revenue) || 0,
      cost: parseFloat(row.cost) || 0,
      profit: parseFloat(row.profit) || 0,
      totalSales: parseInt(row.total_sales) || 0,
      totalQuantity: parseInt(row.total_quantity) || 0,
    }));
  }

  async getTopProducts(filters: AnalyticsFilterDto, limit: number = 10) {
    let query = `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.category,
        p.platform,
        SUM(s.quantity) as total_quantity_sold,
        SUM(s.total_revenue) as total_revenue,
        SUM(s.total_cost) as total_cost,
        COUNT(s.id) as total_sales,
        AVG(s.unit_price) as average_price
      FROM products p
      INNER JOIN sales s ON p.id = s.product_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      query += ` AND s.sale_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(filters.startDate, filters.endDate);
      paramIndex += 2;
    }

    if (filters.category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.platform) {
      query += ` AND s.platform = $${paramIndex}`;
      params.push(filters.platform);
      paramIndex++;
    }

    query += ` 
      GROUP BY p.id, p.sku, p.name, p.category, p.platform
      ORDER BY total_revenue DESC
      LIMIT $${paramIndex}
    `;
    params.push(limit);

    const results = await this.saleRepository.query(query, params);

    return results.map(row => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      platform: row.platform,
      totalQuantitySold: parseInt(row.total_quantity_sold) || 0,
      totalRevenue: parseFloat(row.total_revenue) || 0,
      totalCost: parseFloat(row.total_cost) || 0,
      profit: (parseFloat(row.total_revenue) || 0) - (parseFloat(row.total_cost) || 0),
      totalSales: parseInt(row.total_sales) || 0,
      averagePrice: parseFloat(row.average_price) || 0,
    }));
  }

  async getCategorySummary(filters: AnalyticsFilterDto) {
    let query = `
      SELECT 
        p.category,
        COUNT(DISTINCT p.id) as total_products,
        SUM(s.quantity) as total_quantity_sold,
        SUM(s.total_revenue) as total_revenue,
        SUM(s.total_cost) as total_cost,
        COUNT(s.id) as total_sales
      FROM products p
      LEFT JOIN sales s ON p.id = s.product_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      query += ` AND (s.sale_date IS NULL OR s.sale_date BETWEEN $${paramIndex} AND $${paramIndex + 1})`;
      params.push(filters.startDate, filters.endDate);
      paramIndex += 2;
    }

    if (filters.platform) {
      query += ` AND (s.platform IS NULL OR s.platform = $${paramIndex})`;
      params.push(filters.platform);
      paramIndex++;
    }

    query += ` GROUP BY p.category ORDER BY total_revenue DESC NULLS LAST`;

    const results = await this.saleRepository.query(query, params);

    return results.map(row => ({
      category: row.category,
      totalProducts: parseInt(row.total_products) || 0,
      totalQuantitySold: parseInt(row.total_quantity_sold) || 0,
      totalRevenue: parseFloat(row.total_revenue) || 0,
      totalCost: parseFloat(row.total_cost) || 0,
      profit: (parseFloat(row.total_revenue) || 0) - (parseFloat(row.total_cost) || 0),
      totalSales: parseInt(row.total_sales) || 0,
    }));
  }

  async getPlatformComparison(filters: AnalyticsFilterDto) {
    let query = `
      SELECT 
        s.platform,
        COUNT(DISTINCT s.product_id) as unique_products,
        SUM(s.quantity) as total_quantity_sold,
        SUM(s.total_revenue) as total_revenue,
        SUM(s.total_cost) as total_cost,
        COUNT(s.id) as total_sales,
        AVG(s.unit_price) as average_price
      FROM sales s
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      query += ` AND s.sale_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(filters.startDate, filters.endDate);
      paramIndex += 2;
    }

    if (filters.category) {
      query += ` AND s.product_id IN (
        SELECT id FROM products WHERE category = $${paramIndex}
      )`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ` GROUP BY s.platform ORDER BY total_revenue DESC`;

    const results = await this.saleRepository.query(query, params);

    return results.map(row => ({
      platform: row.platform,
      uniqueProducts: parseInt(row.unique_products) || 0,
      totalQuantitySold: parseInt(row.total_quantity_sold) || 0,
      totalRevenue: parseFloat(row.total_revenue) || 0,
      totalCost: parseFloat(row.total_cost) || 0,
      profit: (parseFloat(row.total_revenue) || 0) - (parseFloat(row.total_cost) || 0),
      totalSales: parseInt(row.total_sales) || 0,
      averagePrice: parseFloat(row.average_price) || 0,
    }));
  }

  async getPerformanceMetrics(filters: AnalyticsFilterDto) {
    const currentQuery = this.buildMetricsQuery('current', filters);
    const previousQuery = this.buildMetricsQuery('previous', filters);

    const [currentResults, previousResults] = await Promise.all([
      this.saleRepository.query(currentQuery.query, currentQuery.params),
      this.saleRepository.query(previousQuery.query, previousQuery.params),
    ]);

    const current = currentResults[0] || {};
    const previous = previousResults[0] || {};

    const calculateGrowth = (current: number, previous: number) => {
      if (!previous || previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      current: {
        totalRevenue: parseFloat(current.total_revenue) || 0,
        totalCost: parseFloat(current.total_cost) || 0,
        profit: (parseFloat(current.total_revenue) || 0) - (parseFloat(current.total_cost) || 0),
        totalSales: parseInt(current.total_sales) || 0,
        totalQuantity: parseInt(current.total_quantity) || 0,
        averageOrderValue: parseFloat(current.average_order_value) || 0,
      },
      previous: {
        totalRevenue: parseFloat(previous.total_revenue) || 0,
        totalCost: parseFloat(previous.total_cost) || 0,
        profit: (parseFloat(previous.total_revenue) || 0) - (parseFloat(previous.total_cost) || 0),
        totalSales: parseInt(previous.total_sales) || 0,
        totalQuantity: parseInt(previous.total_quantity) || 0,
        averageOrderValue: parseFloat(previous.average_order_value) || 0,
      },
      growth: {
        revenueGrowth: calculateGrowth(
          parseFloat(current.total_revenue) || 0,
          parseFloat(previous.total_revenue) || 0
        ),
        salesGrowth: calculateGrowth(
          parseInt(current.total_sales) || 0,
          parseInt(previous.total_sales) || 0
        ),
        profitGrowth: calculateGrowth(
          (parseFloat(current.total_revenue) || 0) - (parseFloat(current.total_cost) || 0),
          (parseFloat(previous.total_revenue) || 0) - (parseFloat(previous.total_cost) || 0)
        ),
      },
    };
  }

  private buildMetricsQuery(period: 'current' | 'previous', filters: AnalyticsFilterDto) {
    let query = `
      SELECT 
        SUM(s.total_revenue) as total_revenue,
        SUM(s.total_cost) as total_cost,
        COUNT(s.id) as total_sales,
        SUM(s.quantity) as total_quantity,
        AVG(s.total_revenue) as average_order_value
      FROM sales s
      LEFT JOIN products p ON s.product_id = p.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

      if (period === 'current') {
        query += ` AND s.sale_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
        params.push(filters.startDate, filters.endDate);
      } else {
        // Previous period
        const previousStartDate = new Date(startDate.getTime() - (daysDiff * 24 * 60 * 60 * 1000));
        const previousEndDate = new Date(startDate.getTime() - (24 * 60 * 60 * 1000));
        query += ` AND s.sale_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
        params.push(previousStartDate.toISOString(), previousEndDate.toISOString());
      }
      paramIndex += 2;
    }

    if (filters.category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.platform) {
      query += ` AND s.platform = $${paramIndex}`;
      params.push(filters.platform);
      paramIndex++;
    }

    return { query, params };
  }
}
