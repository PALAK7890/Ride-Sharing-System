import { Driver } from '../model/Driver';
import { Rider } from '../model/Rider';

export interface DriverMatchingStrategy {
  findDriver(rider: Rider, nearByDrivers: Driver[], origin: number, destination: number): Driver | undefined;
}
