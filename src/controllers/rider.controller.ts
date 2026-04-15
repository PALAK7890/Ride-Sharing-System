import { NextFunction, Request, Response } from 'express';
import { RiderService } from '../application/services/RiderService';
import { TripService } from '../application/services/TripService';
import { Rider } from '../model/Rider';
import { parsePositiveInteger, parseRequiredString } from '../utils/requestParsers';

class RiderController {
  constructor(
    private readonly riderService: RiderService,
    private readonly tripService: TripService
  ) {}

  public createRider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body = req.body as Record<string, unknown>;
      const id = parsePositiveInteger(body.id, 'id');
      const name = parseRequiredString(body.name, 'name');
      await this.riderService.register(new Rider(id, name));
      res.status(201).json({ message: 'Rider created' });
    } catch (error) {
      next(error);
    }
  };

  public getRider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const riderId = parsePositiveInteger(req.params.id, 'id');
      const rider = await this.riderService.getRider(riderId);
      res.status(200).json({ id: rider.getId(), name: rider.getName() });
    } catch (error) {
      next(error);
    }
  };

  public getTripHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const riderId = parsePositiveInteger(req.params.riderId, 'riderId');
      const trips = await this.tripService.tripHistory(riderId);
      res.status(200).json({ count: trips.length });
    } catch (error) {
      next(error);
    }
  };
}

export default RiderController;
