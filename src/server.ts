import dotenv from 'dotenv';
import path from 'path';
import App from './app';
import { DriverService } from './application/services/DriverService';
import { RiderService } from './application/services/RiderService';
import { TripService } from './application/services/TripService';
import { StrategyFactory } from './factory/StrategyFactory';
import { PostgresDatabase } from './infrastructure/persistence/PostgresDatabase';
import { PostgresDriverRepository } from './infrastructure/repositories/PostgresDriverRepository';
import { PostgresRiderRepository } from './infrastructure/repositories/PostgresRiderRepository';
import { PostgresTripRepository } from './infrastructure/repositories/PostgresTripRepository';
import DriverRoutes from './routes/driver.routes';
import RiderRoutes from './routes/rider.routes';
import SystemRoutes from './routes/system.routes';
import TripRoutes from './routes/trip.routes';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

async function bootstrap(): Promise<void> {
  const dbUrl = process.env.DB_URL ?? process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DB_URL (or DATABASE_URL) is required. Configure it in your .env file.');
  }

  const postgresDatabase = PostgresDatabase.getInstance(dbUrl);
  await postgresDatabase.initializeSchema();

  const driverRepository = new PostgresDriverRepository(postgresDatabase);
  const riderRepository = new PostgresRiderRepository(postgresDatabase);
  const tripRepository = new PostgresTripRepository(postgresDatabase);

  // eslint-disable-next-line no-console
  console.log('Using Postgres persistence.');

  const driverService = new DriverService(driverRepository);
  const riderService = new RiderService(riderRepository);
  const tripService = new TripService(
    tripRepository,
    riderRepository,
    driverRepository,
    StrategyFactory.createPricingStrategy(),
    StrategyFactory.createDriverMatchingStrategy()
  );

  const app = new App([
    new SystemRoutes(),
    new DriverRoutes(driverService, tripService),
    new RiderRoutes(riderService, tripService),
    new TripRoutes(tripService)
  ]);

  app.startServer();
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});
