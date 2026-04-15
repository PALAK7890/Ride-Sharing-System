import { DriverNotFoundException } from '../../exception/DriverNotFoundException';
import { InvalidRideParamException } from '../../exception/InvalidRideParamException';
import { TripNotFoundException } from '../../exception/TripNotFoundException';
import { TripStatusException } from '../../exception/TripStatusException';
import { DriverRepository } from '../../domain/repositories/DriverRepository';
import { RiderRepository } from '../../domain/repositories/RiderRepository';
import { TripRepository } from '../../domain/repositories/TripRepository';
import { Driver } from '../../model/Driver';
import { Trip } from '../../model/Trip';
import { TripStatus } from '../../model/TripStatus';
import { DriverMatchingStrategy } from '../../strategy/DriverMatchingStrategy';
import { PricingStrategy } from '../../strategy/PricingStrategy';
import {
  DESTINATION_OPTIONS,
  DESTINATION_OPTION_LABELS,
  ORIGIN_OPTIONS,
  ORIGIN_OPTION_LABELS
} from '../../constants/locationOptions';

export class TripService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly riderRepository: RiderRepository,
    private readonly driverRepository: DriverRepository,
    private readonly pricingStrategy: PricingStrategy,
    private readonly driverMatchingStrategy: DriverMatchingStrategy
  ) {}

  public async createTrip(
    riderId: number,
    origin: number,
    destination: number,
    seats: number
  ): Promise<string> {
    this.validateLocations(origin, destination);

    if (origin >= destination) {
      throw new InvalidRideParamException(
        'Destination should be greater than origin, try with a valid request.'
      );
    }

    const rider = await this.riderRepository.findById(riderId);
    if (!rider) {
      throw new TripNotFoundException(`Rider with rider Id = ${riderId} not found.`);
    }

    const availableDrivers = (await this.driverRepository.findAll()).filter((driver) =>
      driver.isAvailable()
    );
    const driver = this.driverMatchingStrategy.findDriver(rider, availableDrivers, origin, destination);

    if (!driver) {
      throw new DriverNotFoundException('Driver not found, Please try after some time');
    }

    const fare = await this.calculateFare(riderId, origin, destination, seats);
    const trip = new Trip(rider, driver, origin, destination, seats, fare);
    await this.tripRepository.save(riderId, trip);
    driver.setCurrentTrip(trip);
    await this.driverRepository.update(driver);

    return trip.getId();
  }

  public async updateTrip(
    tripId: string,
    origin: number,
    destination: number,
    seats: number
  ): Promise<void> {
    this.validateLocations(origin, destination);

    if (origin >= destination) {
      throw new InvalidRideParamException(
        'Destination should be greater than origin, try with a valid request.'
      );
    }

    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new TripNotFoundException(
        `No Trip found for the given Id = ${tripId}, please try with valid Trip Id.`
      );
    }

    if (trip.getStatus() === TripStatus.COMPLETED || trip.getStatus() === TripStatus.WITHDRAWN) {
      throw new TripStatusException(
        'Trip has already been completed or withdrawn try with valid Trip Id.'
      );
    }

    const fare = await this.calculateFare(trip.getRider().getId(), origin, destination, seats);
    trip.updateTrip(origin, destination, seats, fare);
    await this.tripRepository.update(trip);
  }

  public async withdrawTrip(tripId: string): Promise<void> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new TripNotFoundException(
        `No Trip found for the given Id = ${tripId}, please try with valid Trip Id.`
      );
    }

    if (trip.getStatus() === TripStatus.COMPLETED) {
      throw new TripStatusException("Trip has already been completed, can't withdraw now.");
    }

    const driver = trip.getDriver();
    driver.setCurrentTrip(null);
    trip.withdrawTrip();
    await this.tripRepository.update(trip);
    await this.driverRepository.update(driver);
  }

  public async endTrip(driverId: number): Promise<number> {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver || driver.getCurrentTrip() === null) {
      throw new TripNotFoundException('Currently rider is not riding, please try again.');
    }

    const currentTrip = driver.getCurrentTrip()!;
    const fare = currentTrip.getFare();
    currentTrip.endTrip();
    driver.setCurrentTrip(null);
    await this.tripRepository.update(currentTrip);
    await this.driverRepository.update(driver);

    return fare;
  }

  public async tripHistory(riderId: number): Promise<Trip[]> {
    return this.tripRepository.findByRiderId(riderId);
  }

  private async calculateFare(
    riderId: number,
    origin: number,
    destination: number,
    seats: number
  ): Promise<number> {
    return (await this.isPreferredRider(riderId))
      ? this.pricingStrategy.calculateFareForPreferred(origin, destination, seats)
      : this.pricingStrategy.calculateFare(origin, destination, seats);
  }

  private async isPreferredRider(riderId: number): Promise<boolean> {
    return (await this.tripRepository.findByRiderId(riderId)).length >= 10;
  }

  private validateLocations(origin: number, destination: number): void {
    if (!ORIGIN_OPTIONS.includes(origin as (typeof ORIGIN_OPTIONS)[number])) {
      throw new InvalidRideParamException(
        `Origin should be one of: ${this.formatLocationOptions(ORIGIN_OPTION_LABELS)}`
      );
    }

    if (!DESTINATION_OPTIONS.includes(destination as (typeof DESTINATION_OPTIONS)[number])) {
      throw new InvalidRideParamException(
        `Destination should be one of: ${this.formatLocationOptions(DESTINATION_OPTION_LABELS)}`
      );
    }
  }

  private formatLocationOptions(options: Record<number, string>): string {
    return Object.entries(options)
      .map(([code, city]) => `${code} (${city})`)
      .join(', ');
  }
}
