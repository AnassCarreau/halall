import { describe, it, expect } from 'vitest';
import { calculateDistanceKm, formatDistance } from '@/domain/geo/haversine';

describe('Haversine distance calculation', () => {
  it('calculates distance between Puerta del Sol (Madrid) and Plaza Mayor', () => {
    const solLat = 40.4168;
    const solLng = -3.7038;
    const mayorLat = 40.4154;
    const mayorLng = -3.7074;

    const dist = calculateDistanceKm(solLat, solLng, mayorLat, mayorLng);
    expect(dist).toBeGreaterThan(0.3);
    expect(dist).toBeLessThan(0.5); // ~350 metros
  });

  it('calculates distance between Madrid and Barcelona accurately (~505 km)', () => {
    const madridLat = 40.4168;
    const madridLng = -3.7038;
    const bcnLat = 41.3851;
    const bcnLng = 2.1734;

    const dist = calculateDistanceKm(madridLat, madridLng, bcnLat, bcnLng);
    expect(dist).toBeGreaterThan(500);
    expect(dist).toBeLessThan(515);
  });

  it('formats distances cleanly for UI', () => {
    expect(formatDistance(0.45)).toBe('450 m');
    expect(formatDistance(1.84)).toBe('1.8 km');
    expect(formatDistance(12.0)).toBe('12.0 km');
  });
});
