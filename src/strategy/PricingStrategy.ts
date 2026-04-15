export const AMT_PER_KM = 20;

export interface PricingStrategy {
  calculateFare(origin: number, destination: number, seats: number): number;
  calculateFareForPreferred(origin: number, destination: number, seats: number): number;
}
