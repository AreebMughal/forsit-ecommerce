import { PLATFORM, PRODUCT_CATEGORY } from 'src/constants/product.enum';
import { getDataSource, closeDataSource } from '../data-source';
import { Inventory, Product, Sale } from 'src/entities';
import { INVENTORY_CHANGE_TYPE } from 'src/constants/inventory.enum';

async function seed() {
  let dataSource;
  
  try {
    // Get the configured DataSource
    dataSource = await getDataSource();
    
    const productRepository = dataSource.getRepository(Product);
    const saleRepository = dataSource.getRepository(Sale);
    const inventoryRepository = dataSource.getRepository(Inventory);

    console.log('Starting database seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await inventoryRepository.delete({});
    await saleRepository.delete({});
    await productRepository.delete({});

    // Sample products for Amazon and Walmart
    const products = [
      // Amazon Electronics
      { sku: 'AMZ-ELEC-001', name: 'Wireless Bluetooth Headphones', category: PRODUCT_CATEGORY.ELECTRONICS, price: 89.99, cost: 45.00, platform: PLATFORM.AMAZON },
      { sku: 'AMZ-ELEC-002', name: 'Smart Watch Series 5', category: PRODUCT_CATEGORY.ELECTRONICS, price: 299.99, cost: 150.00, platform: PLATFORM.AMAZON },
      { sku: 'AMZ-ELEC-003', name: 'USB-C Charging Cable', category: PRODUCT_CATEGORY.ELECTRONICS, price: 19.99, cost: 8.00, platform: PLATFORM.AMAZON },
      { sku: 'AMZ-ELEC-004', name: 'Wireless Phone Charger', category: PRODUCT_CATEGORY.ELECTRONICS, price: 34.99, cost: 18.00, platform: PLATFORM.AMAZON },
      
      // Amazon Clothing
      { sku: 'AMZ-CLTH-001', name: 'Cotton T-Shirt Pack (3-Pack)', category: PRODUCT_CATEGORY.CLOTHING, price: 24.99, cost: 12.00, platform: PLATFORM.AMAZON },
      { sku: 'AMZ-CLTH-002', name: 'Denim Jeans - Classic Fit', category: PRODUCT_CATEGORY.CLOTHING, price: 49.99, cost: 25.00, platform: PLATFORM.AMAZON },
      { sku: 'AMZ-CLTH-003', name: 'Athletic Running Shoes', category: PRODUCT_CATEGORY.CLOTHING, price: 79.99, cost: 40.00, platform: PLATFORM.AMAZON },
      
      // Amazon Home
      { sku: 'AMZ-HOME-001', name: 'Ceramic Coffee Mug Set', category: PRODUCT_CATEGORY.HOME, price: 28.99, cost: 14.00, platform: PLATFORM.AMAZON },
      { sku: 'AMZ-HOME-002', name: 'LED Desk Lamp', category: PRODUCT_CATEGORY.HOME, price: 45.99, cost: 22.00, platform: PLATFORM.AMAZON },
      { sku: 'AMZ-HOME-003', name: 'Memory Foam Pillow', category: PRODUCT_CATEGORY.HOME, price: 39.99, cost: 20.00, platform: PLATFORM.AMAZON },
      
      // Walmart Electronics
      { sku: 'WMT-ELEC-001', name: 'Tablet 10-inch Screen', category: PRODUCT_CATEGORY.ELECTRONICS, price: 199.99, cost: 120.00, platform: PLATFORM.WALMART },
      { sku: 'WMT-ELEC-002', name: 'Bluetooth Speaker', category: PRODUCT_CATEGORY.ELECTRONICS, price: 59.99, cost: 30.00, platform: PLATFORM.WALMART },
      { sku: 'WMT-ELEC-003', name: 'Gaming Mouse', category: PRODUCT_CATEGORY.ELECTRONICS, price: 29.99, cost: 15.00, platform: PLATFORM.WALMART },
      
      // Walmart Clothing
      { sku: 'WMT-CLTH-001', name: 'Winter Jacket', category: PRODUCT_CATEGORY.CLOTHING, price: 89.99, cost: 45.00, platform: PLATFORM.WALMART },
      { sku: 'WMT-CLTH-002', name: 'Casual Sneakers', category: PRODUCT_CATEGORY.CLOTHING, price: 54.99, cost: 28.00, platform: PLATFORM.WALMART },
      
      // Walmart Home
      { sku: 'WMT-HOME-001', name: 'Kitchen Knife Set', category: PRODUCT_CATEGORY.HOME, price: 69.99, cost: 35.00, platform: PLATFORM.WALMART },
      { sku: 'WMT-HOME-002', name: 'Throw Blanket', category: PRODUCT_CATEGORY.HOME, price: 24.99, cost: 12.00, platform: PLATFORM.WALMART },
      
      // Books
      { sku: 'AMZ-BOOK-001', name: 'Business Strategy Guide', category: PRODUCT_CATEGORY.BOOKS, price: 19.99, cost: 8.00, platform: PLATFORM.AMAZON },
      { sku: 'WMT-BOOK-001', name: 'Cooking Essentials', category: PRODUCT_CATEGORY.BOOKS, price: 16.99, cost: 7.00, platform: PLATFORM.WALMART },
      
      // Sports
      { sku: 'AMZ-SPRT-001', name: 'Yoga Mat Premium', category: PRODUCT_CATEGORY.SPORTS, price: 34.99, cost: 18.00, platform: PLATFORM.AMAZON },
      { sku: 'WMT-SPRT-001', name: 'Resistance Bands Set', category: PRODUCT_CATEGORY.SPORTS, price: 22.99, cost: 11.00, platform: PLATFORM.WALMART },
    ];

    // Create products
    console.log('Creating products...');
    const createdProducts = [];
    for (const productData of products) {
      const product = productRepository.create(productData);
      const savedProduct = await productRepository.save(product);
      createdProducts.push(savedProduct);
    }

    console.log(`Created ${createdProducts.length} products`);

    // Generate initial inventory records
    console.log('Creating initial inventory...');
    for (const product of createdProducts) {
      const initialStock = Math.floor(Math.random() * 100) + 50; // 50-150 initial stock
      
      const inventoryRecord = inventoryRepository.create({
        productId: product.id,
        quantityBefore: 0,
        quantityChange: initialStock,
        quantityAfter: initialStock,
        changeType: INVENTORY_CHANGE_TYPE.RESTOCK,
        reason: 'Initial stock',
        changeDate: new Date('2024-01-01'),
      });
      
      await inventoryRepository.save(inventoryRecord);
    }

    console.log('Created initial inventory records');

    // Generate sales data for the last 12 months
    console.log('Generating sales data...');
    const sales = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Generate 5-15 sales per day
      const salesPerDay = Math.floor(Math.random() * 10) + 5;
      
      for (let i = 0; i < salesPerDay; i++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity
        
        // Add some price variation (±10%)
        const priceVariation = (Math.random() - 0.5) * 0.2;
        const unitPrice = product.price * (1 + priceVariation);
        
        const sale = {
          productId: product.id,
          quantity,
          unitPrice: parseFloat(unitPrice.toFixed(2)),
          totalRevenue: parseFloat((quantity * unitPrice).toFixed(2)),
          totalCost: product.cost ? parseFloat((quantity * product.cost).toFixed(2)) : null,
          platform: product.platform,
          saleDate: new Date(d),
        };
        
        sales.push(sale);
      }
    }

    // Save sales in batches
    console.log('Saving sales records...');
    const batchSize = 100;
    for (let i = 0; i < sales.length; i += batchSize) {
      const batch = sales.slice(i, i + batchSize);
      const saleEntities = batch.map(saleData => saleRepository.create(saleData));
      await saleRepository.save(saleEntities);
      
      // Update inventory for each sale
      for (const saleData of batch) {
        const lastInventory = await inventoryRepository.findOne({
          where: { productId: saleData.productId },
          order: { changeDate: 'DESC' },
        });
        
        if (lastInventory && lastInventory.quantityAfter >= saleData.quantity) {
          const newQuantity = lastInventory.quantityAfter - saleData.quantity;
          
          const inventoryRecord = inventoryRepository.create({
            productId: saleData.productId,
            quantityBefore: lastInventory.quantityAfter,
            quantityChange: -saleData.quantity,
            quantityAfter: newQuantity,
            changeType: INVENTORY_CHANGE_TYPE.SALE,
            reason: 'Product sold',
            changeDate: saleData.saleDate,
          });
          
          await inventoryRepository.save(inventoryRecord);
        }
      }
      
      // Log progress
      if ((i + batchSize) % 500 === 0 || i + batchSize >= sales.length) {
        console.log(`Processed ${Math.min(i + batchSize, sales.length)} of ${sales.length} sales`);
      }
    }

    console.log(`Created ${sales.length} sales records`);

    // Add some restocking events throughout the year
    console.log('Adding restocking events...');
    const restockingEvents = [];
    
    for (const product of createdProducts) {
      // Add 2-4 restocking events per product throughout the year
      const restockCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < restockCount; i++) {
        // Random date between March and November (avoiding initial stock and end of year)
        const restockMonth = Math.floor(Math.random() * 9) + 3; // March to November
        const restockDay = Math.floor(Math.random() * 28) + 1;
        const restockDate = new Date(2024, restockMonth - 1, restockDay);
        
        const restockQuantity = Math.floor(Math.random() * 80) + 20; // 20-100 restock quantity
        
        restockingEvents.push({
          product,
          quantity: restockQuantity,
          date: restockDate,
        });
      }
    }

    // Sort restocking events by date
    restockingEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Process restocking events
    for (const restockEvent of restockingEvents) {
      const lastInventory = await inventoryRepository.findOne({
        where: { productId: restockEvent.product.id },
        order: { changeDate: 'DESC' },
      });

      if (lastInventory) {
        const newQuantity = lastInventory.quantityAfter + restockEvent.quantity;
        
        const inventoryRecord = inventoryRepository.create({
          productId: restockEvent.product.id,
          quantityBefore: lastInventory.quantityAfter,
          quantityChange: restockEvent.quantity,
          quantityAfter: newQuantity,
          changeType: INVENTORY_CHANGE_TYPE.RESTOCK,
          reason: 'Scheduled restock',
          changeDate: restockEvent.date,
        });
        
        await inventoryRepository.save(inventoryRecord);
      }
    }

    console.log(`Created ${restockingEvents.length} restocking events`);

    // Add some adjustment events (for damaged goods, returns, etc.)
    console.log('Adding inventory adjustments...');
    const adjustmentEvents = [];
    
    for (const product of createdProducts) {
      // 30% chance of having an adjustment event
      if (Math.random() < 0.3) {
        const adjustmentMonth = Math.floor(Math.random() * 12) + 1;
        const adjustmentDay = Math.floor(Math.random() * 28) + 1;
        const adjustmentDate = new Date(2024, adjustmentMonth - 1, adjustmentDay);
        
        // Small negative adjustment (1-10 items)
        const adjustmentQuantity = -(Math.floor(Math.random() * 10) + 1);
        const reasons = ['Damaged goods', 'Lost in warehouse', 'Quality control removal', 'Customer return - damaged'];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        
        adjustmentEvents.push({
          product,
          quantity: adjustmentQuantity,
          date: adjustmentDate,
          reason,
        });
      }
    }

    // Sort adjustment events by date
    adjustmentEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Process adjustment events
    for (const adjustmentEvent of adjustmentEvents) {
      const lastInventory = await inventoryRepository.findOne({
        where: { productId: adjustmentEvent.product.id },
        order: { changeDate: 'DESC' },
      });

      if (lastInventory && lastInventory.quantityAfter >= Math.abs(adjustmentEvent.quantity)) {
        const newQuantity = lastInventory.quantityAfter + adjustmentEvent.quantity;
        
        const inventoryRecord = inventoryRepository.create({
          productId: adjustmentEvent.product.id,
          quantityBefore: lastInventory.quantityAfter,
          quantityChange: adjustmentEvent.quantity,
          quantityAfter: Math.max(0, newQuantity), // Ensure we don't go negative
          changeType: INVENTORY_CHANGE_TYPE.ADJUSTMENT,
          reason: adjustmentEvent.reason,
          changeDate: adjustmentEvent.date,
        });
        
        await inventoryRepository.save(inventoryRecord);
      }
    }

    console.log(`Created ${adjustmentEvents.length} inventory adjustments`);

    // Generate summary statistics
    const totalProducts = await productRepository.count();
    const totalSales = await saleRepository.count();
    const totalInventoryRecords = await inventoryRepository.count();
    
    const totalRevenue = await saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.totalRevenue)', 'total')
      .getRawOne();
    
    const totalCost = await saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.totalCost)', 'total')
      .getRawOne();

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log(`Products created: ${totalProducts}`);
    console.log(`Sales records: ${totalSales}`);
    console.log(`Inventory records: ${totalInventoryRecords}`);
    console.log(`Total revenue: $${parseFloat(totalRevenue.total || 0).toFixed(2)}`);
    console.log(`Total cost: $${parseFloat(totalCost.total || 0).toFixed(2)}`);
    console.log(`Estimated profit: $${(parseFloat(totalRevenue.total || 0) - parseFloat(totalCost.total || 0)).toFixed(2)}`);
    console.log('=====================================\n');

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    // Clean up the DataSource connection
    await closeDataSource();
    console.log('Database connection closed');
  }
}

// Execute the seed function
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seed };