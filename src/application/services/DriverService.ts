import { DriverAlreadyPresentException } from '../../exception/DriverAlreadyPresentException';
import { DriverNotFoundException } from '../../exception/DriverNotFoundException';
import { DriverRepository } from '../../domain/repositories/DriverRepository';
import { Driver } from '../../model/Driver';

export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  public async register(driver: Driver): Promise<void> {
    if (await this.driverRepository.findById(driver.getId())) {
      throw new DriverAlreadyPresentException(
        `Driver with driver id = ${driver.getId()} already present, try with different Id.`
      );
    }
    await this.driverRepository.save(driver);
  }

  public async updateAvailability(driverId: number, available: boolean): Promise<void> {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new DriverNotFoundException(
        `No driver with driver id = ${driverId}, try with correct driver Id.`
      );
    }
    driver.setAcceptingRider(available);
    await this.driverRepository.update(driver);
  }

  public async getAvailableDrivers(): Promise<Driver[]> {
    return (await this.driverRepository.findAll()).filter((driver) => driver.isAvailable());
  }

  public async getDriver(driverId: number): Promise<Driver> {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new DriverNotFoundException(`No driver with driver id = ${driverId}.`);
    }
    return driver;
  }
}
