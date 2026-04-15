import { NextFunction, Request, Response } from 'express';
import { DriverService } from '../application/services/DriverService';
import { TripService } from '../application/services/TripService';
import { Driver } from '../model/Driver';
import { parseBoolean, parsePositiveInteger, parseRequiredString } from '../utils/requestParsers';

class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly tripService: TripService
  ) {}

  public createDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body = req.body as Record<string, unknown>;
      const id = parsePositiveInteger(body.id, 'id');
      const name = parseRequiredString(body.name, 'name');
      await this.driverService.register(new Driver(id, name));
      res.status(201).json({ message: 'Driver created' });
    } catch (error) {
      next(error);
    }
  };

  public updateDriverAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const driverId = parsePositiveInteger(req.params.id, 'id');
      const { available } = req.body as { available: unknown };
      await this.driverService.updateAvailability(driverId, parseBoolean(available, 'available'));
      res.status(200).json({ message: 'Driver availability updated' });
    } catch (error) {
      next(error);
    }
  };

  public getAvailableDrivers = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const drivers = await this.driverService.getAvailableDrivers();
      res.status(200).json({ count: drivers.length });
    } catch (error) {
      next(error);
    }
  };

  public endTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const driverId = parsePositiveInteger(req.params.driverId, 'driverId');
      const fare = await this.tripService.endTrip(driverId);
      res.status(200).json({ fare });
    } catch (error) {
      next(error);
    }
  };
}

export default DriverController;
