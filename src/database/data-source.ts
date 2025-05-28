import { DataSource } from 'typeorm';
import { entities } from '../entities';
import * as dotenv from 'dotenv';
dotenv.config(); 

export function createDataSourceOptions() {
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  };
}

// Create a singleton DataSource instance
let dataSourceInstance: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (!dataSourceInstance) {
    const options = createDataSourceOptions();
    dataSourceInstance = new DataSource(options);
  }

  if (!dataSourceInstance.isInitialized) {
    await dataSourceInstance.initialize();
  }

  return dataSourceInstance;
}

// Function to close the DataSource
export async function closeDataSource(): Promise<void> {
  if (dataSourceInstance && dataSourceInstance.isInitialized) {
    await dataSourceInstance.destroy();
    dataSourceInstance = null;
  }
}

// Export a default DataSource for use in migrations and CLI commands
export const AppDataSource = new DataSource(createDataSourceOptions());
