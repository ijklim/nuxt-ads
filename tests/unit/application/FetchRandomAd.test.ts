// tests/unit/application/FetchRandomAd.test.ts
import { describe, it, expect } from 'vitest';
import { FetchRandomAdUseCase } from '../../../application/use-cases/FetchRandomAd';
import type { IAdRepository } from '../../../application/ports/IAdRepository';
import { Result } from '../../../domain/shared/result';
import type { Ad } from '../../../domain/ads/types';

class MockAdRepository implements IAdRepository {
  async fetchRandom(filters?: Record<string, string>): Promise<Result<Ad, Error>> {
    if (filters?.error) {
        return Result.err(new Error('Mock fetch failed'));
    }
    // Return a valid mock ad
    const mockAd: Ad = {
        id: '123',
        type: 'ImageAd',
        displayRatio: 1,
        href: 'https://example.com',
        imageUrl: 'https://example.com/img.png',
        imageAlt: 'Mock Ad',
        height: 100,
        width: 100
    };
    return Result.ok(mockAd);
  }
}

describe('FetchRandomAdUseCase', () => {
    it('should return an ad on success', async () => {
        const repo = new MockAdRepository();
        const useCase = new FetchRandomAdUseCase(repo);

        const result = await useCase.execute();

        expect(result.isOk).toBe(true);
        if (result.isOk) {
            expect(result.value.id).toBe('123');
        }
    });

    it('should return error on failure', async () => {
         const repo = new MockAdRepository();
         const useCase = new FetchRandomAdUseCase(repo);

         const result = await useCase.execute({ error: 'true' });

         expect(result.isErr).toBe(true);
         if (result.isErr) {
             expect(result.error).toBeInstanceOf(Error);
         }
    });
});
