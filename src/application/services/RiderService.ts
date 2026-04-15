import { RiderAlreadyPresentException } from '../../exception/RiderAlreadyPresentException';
import { RiderNotFoundException } from '../../exception/RiderNotFoundException';
import { RiderRepository } from '../../domain/repositories/RiderRepository';
import { Rider } from '../../model/Rider';

export class RiderService {
  constructor(private readonly riderRepository: RiderRepository) {}

  public async register(rider: Rider): Promise<void> {
    if (await this.riderRepository.findById(rider.getId())) {
      throw new RiderAlreadyPresentException(
        `Rider with rider Id = ${rider.getId()} already present, try with different Id.`
      );
    }
    await this.riderRepository.save(rider);
  }

  public async getRider(riderId: number): Promise<Rider> {
    const rider = await this.riderRepository.findById(riderId);
    if (!rider) {
      throw new RiderNotFoundException(`Rider with rider Id = ${riderId} not found.`);
    }
    return rider;
  }
}
