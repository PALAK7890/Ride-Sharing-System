import { Driver } from '../model/Driver';
import { Rider } from '../model/Rider';
import { DriverMatchingStrategy } from './DriverMatchingStrategy';

export class OptimalDriverStrategy implements DriverMatchingStrategy {
  public findDriver(
    _rider: Rider,
    nearByDrivers: Driver[],
    _origin: number,
    _destination: number
  ): Driver | undefined {
    return nearByDrivers[0];
  }
}
