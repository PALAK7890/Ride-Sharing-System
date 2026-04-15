import { NextFunction, Request, Response } from 'express';
import { TripService } from '../application/services/TripService';
import { parsePositiveInteger, parseRequiredString } from '../utils/requestParsers';

class TripController {
  constructor(private readonly tripService: TripService) {}

  public createTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as Record<string, unknown>;
      const riderId = parsePositiveInteger(body.riderId, 'riderId');
      const origin = parsePositiveInteger(body.origin, 'origin');
      const destination = parsePositiveInteger(body.destination, 'destination');
      const seats = parsePositiveInteger(body.seats, 'seats');

      const tripId = await this.tripService.createTrip(riderId, origin, destination, seats);
      res.status(201).json({ tripId });
    } catch (error) {
      next(error);
    }
  };

  public updateTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as Record<string, unknown>;
      const origin = parsePositiveInteger(body.origin, 'origin');
      const destination = parsePositiveInteger(body.destination, 'destination');
      const seats = parsePositiveInteger(body.seats, 'seats');

      const tripId = parseRequiredString(req.params.tripId, 'tripId');
      await this.tripService.updateTrip(tripId, origin, destination, seats);
      res.status(200).json({ message: 'Trip updated' });
    } catch (error) {
      next(error);
    }
  };

  public withdrawTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tripId = parseRequiredString(req.params.tripId, 'tripId');
      await this.tripService.withdrawTrip(tripId);
      res.status(200).json({ message: 'Trip withdrawn' });
    } catch (error) {
      next(error);
    }
  };
}

export default TripController;
