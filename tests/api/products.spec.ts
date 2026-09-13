import { expect, test } from '@playwright/test';
import { config } from '../../src/config';

interface Product {
  id: string
  name: string
  description: string
  price: number
  is_location_offer: boolean
  is_rental: boolean
  in_stock: boolean
  is_eco_friendly: boolean
}

interface ProductsResponse {
  current_page: number
  data: Product[]
  last_page: number
  per_page: number
  total: number
}

test.describe('GET /products', () => {
  test('returns a paginated list of products', async ({ request }) => {
    const response = await request.get(`${config.sut.apiUrl}/products`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = (await response.json()) as ProductsResponse;

    expect(body).toMatchObject({
      current_page: expect.any(Number),
      last_page: expect.any(Number),
      per_page: expect.any(Number),
      total: expect.any(Number),
    });
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    for (const product of body.data) {
      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        is_location_offer: expect.any(Boolean),
        is_rental: expect.any(Boolean),
        in_stock: expect.any(Boolean),
        is_eco_friendly: expect.any(Boolean),
      });
    }
  });
});
