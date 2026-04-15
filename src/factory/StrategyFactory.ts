import { DefaultPricingStrategy } from '../strategy/DefaultPricingStrategy';
import { DriverMatchingStrategy } from '../strategy/DriverMatchingStrategy';
import { OptimalDriverStrategy } from '../strategy/OptimalDriverStrategy';
import { PricingStrategy } from '../strategy/PricingStrategy';

export class StrategyFactory {
  public static createPricingStrategy(type: 'default' = 'default'): PricingStrategy {
    switch (type) {
      case 'default':
      default:
        return new DefaultPricingStrategy();
    }
  }

  public static createDriverMatchingStrategy(type: 'optimal' = 'optimal'): DriverMatchingStrategy {
    switch (type) {
      case 'optimal':
      default:
        return new OptimalDriverStrategy();
    }
  }
}
