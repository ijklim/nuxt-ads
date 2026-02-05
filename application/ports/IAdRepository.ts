import type { Result } from '../../domain/shared/result';
import type { Ad } from '../../domain/ads/types';

export interface IAdRepository {
  fetchRandom(filters?: Record<string, string>): Promise<Result<Ad, Error>>;
}
