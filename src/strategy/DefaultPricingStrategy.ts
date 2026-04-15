import { AMT_PER_KM, PricingStrategy } from './PricingStrategy';

export class DefaultPricingStrategy implements PricingStrategy {
  public calculateFare(origin: number, destination: number, seats: number): number {
    return AMT_PER_KM * (destination - origin) * seats * (seats > 1 ? 0.75 : 1);
  }

  public calculateFareForPreferred(origin: number, destination: number, seats: number): number {
    return AMT_PER_KM * (destination - origin) * seats * (seats > 1 ? 0.5 : 0.75);
  }
}
