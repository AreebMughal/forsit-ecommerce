# E-Commerce Analytics & Inventory Management API

This project is a backend service built with **NestJS** and **PostgreSQL** using **TypeORM**. It provides a comprehensive API for managing products, sales, and inventory, along with analytics features such as revenue trends, category summaries, and platform comparisons.

---

## 🚀 Features

### 📊 Sales & Analytics
- Analyze revenue trends (daily, weekly, monthly, yearly)
- Compare revenue by category and platform
- View top-performing products
- Track performance metrics with period-over-period comparison
- Retrieve sales summaries and filter sales by date, product, and category

### 📦 Inventory Management
- Get current inventory status and low stock alerts
- Update inventory levels and view change history
- Calculate total inventory value

### 🛍️ Product Management
- Create, update, view, and delete products
- Filter products by category or platform

---

## 🧰 Tech Stack

| Category        | Technology         |
|----------------|--------------------|
| Language        | TypeScript         |
| Framework       | NestJS             |
| Database        | PostgreSQL         |
| ORM             | TypeORM            |
| API Type        | RESTful API        |
| Documentation   | Swagger (OpenAPI)  |

---


## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm 9+

### Installation
1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and copy the contents from `.env.example`, then update the database connection settings.

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Run seeders to populate initial data:
   ```bash
   npm run seed
   ```

5. Start the application:
   ```bash
    npm run start:dev
    ```

6. Access the API documentation at `http://localhost:5000/api`.


## 📚 API Overview

> ⚠️ **Note:** The project requirements were not provided in complete detail. Some assumptions were made while designing the API structure and implementing features. Therefore, the implementation might vary or differ slightly from the intended expectations.



### 🔹 Sales Routes (`/sales`)
| Method | Endpoint                | Description                              |
|--------|-------------------------|------------------------------------------|
| POST   | `/sales`                | Create a new sale                        |
| GET    | `/sales`                | Retrieve all sales with optional filters |
| GET    | `/sales/summary`        | Get summary statistics on sales          |
| GET    | `/sales/:id`            | Get a specific sale by ID                |

---

### 🔹 Analytics Routes (`/analytics`)
| Method | Endpoint                        | Description                                         |
|--------|----------------------------------|-----------------------------------------------------|
| GET    | `/analytics/revenue-trends`     | Revenue trends (daily, weekly, monthly, yearly)     |
| GET    | `/analytics/top-products`       | Get top performing products                         |
| GET    | `/analytics/category-summary`   | Sales summary by product category                   |
| GET    | `/analytics/platform-comparison`| Compare performance across different platforms      |
| GET    | `/analytics/performance-metrics`| Period-over-period performance comparison           |

---

### 🔹 Inventory Routes (`/inventory`)
| Method | Endpoint                     | Description                                     |
|--------|------------------------------|-------------------------------------------------|
| GET    | `/inventory/current`         | Get current inventory status                    |
| GET    | `/inventory/low-stock`       | List products with low stock levels             |
| GET    | `/inventory/value`           | Get total inventory value                       |
| POST   | `/inventory/update`          | Update inventory levels                         |
| GET    | `/inventory/history/:productId` | Inventory change history for a specific product |

---

### 🔹 Product Routes (`/products`)
| Method | Endpoint         | Description                             |
|--------|------------------|-----------------------------------------|
| POST   | `/products`      | Create a new product                    |
| GET    | `/products`      | List all products with optional filters |
| GET    | `/products/:id`  | Get a product by ID                     |
| PATCH  | `/products/:id`  | Update a product                        |
| DELETE | `/products/:id`  | Delete a product                        |


## 🗃️ Database Schema Documentation

The application uses **PostgreSQL** as the primary database and leverages **TypeORM** for schema definition and relationship mapping.

---

### 📦 `products` Table

Stores core product information.

| Column       | Type       | Description                                 |
|--------------|------------|---------------------------------------------|
| id           | UUID       | Primary key                                 |
| sku          | String     | Unique product SKU                          |
| name         | String     | Name of the product                         |
| description  | Text       | Optional description                        |
| category     | Enum       | Product category (e.g., ELECTRONICS, TOYS)  |
| price        | Decimal    | Selling price                               |
| cost         | Decimal    | Optional product cost                       |
| platform     | Enum       | Sales platform (e.g., ONLINE, RETAIL)       |
| isActive     | Boolean    | Status of the product                       |
| created_at   | Timestamp  | Timestamp when created                      |
| updated_at   | Timestamp  | Timestamp when last updated                 |

🔁 **Relationships**:
- One-to-many with `sales`: A product can have multiple sales.
- One-to-many with `inventory`: A product can have multiple inventory records.

---

### 🛒 `sales` Table

Tracks sales transactions for each product.

| Column        | Type       | Description                                |
|---------------|------------|--------------------------------------------|
| id            | UUID       | Primary key                                |
| product_id    | UUID       | Foreign key to `products`                  |
| quantity      | Integer    | Number of items sold                       |
| unit_price    | Decimal    | Price per unit at time of sale             |
| total_revenue | Decimal    | Total revenue from the sale                |
| total_cost    | Decimal    | Optional cost incurred                     |
| platform      | Enum       | Platform on which the sale occurred        |
| sale_date     | Timestamp  | Date and time of sale                      |
| created_at    | Timestamp  | Timestamp when created                     |

🔁 **Relationships**:
- Many-to-one with `products`: Each sale is associated with a single product.

---

### 📊 `inventory` Table

Captures inventory changes and stock movement over time.

| Column           | Type       | Description                                    |
|------------------|------------|------------------------------------------------|
| id               | UUID       | Primary key                                    |
| product_id       | UUID       | Foreign key to `products`                      |
| quantity_before  | Integer    | Quantity before the change                     |
| quantity_change  | Integer    | Change in quantity (positive or negative)      |
| quantity_after   | Integer    | Quantity after the change                      |
| change_type      | Enum       | Type of change (e.g., SALE, RESTOCK)           |
| reason           | String     | Optional description of the reason             |
| change_date      | Timestamp  | Date when the change occurred                  |
| created_at       | Timestamp  | Timestamp when the record was created          |

🔁 **Relationships**:
- Many-to-one with `products`: Each inventory change record is associated with a product.

---

### 🧩 Entity Relationships

- `Product 1 ⟶ * Sale`
- `Product 1 ⟶ * Inventory`

This design ensures normalized data with clear references between sales, inventory, and products.
