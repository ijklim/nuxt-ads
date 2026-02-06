import type { Ad } from '../../domain/ads/types';
import type { IAdRepository } from '../ports/IAdRepository';
import { Result } from '../../domain/shared/result';

export class FetchRandomAdUseCase {
  constructor(private adRepository: IAdRepository) {}

  async execute(filters?: Record<string, string>): Promise<Result<Ad, Error>> {
    // We can add application-level logic here (e.g., logging, additional checks)
    // For now, it simply delegates to the repository which handles fetching + basic validation
    return this.adRepository.fetchRandom(filters);
  }
}
