import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  test('DELETE /api/testing/reset clears database', async ({ request }) => {
    // Call the reset endpoint
    const response = await request.delete('http://localhost:3000/api/testing/reset');
    
    // Should return success (200 or similar)
    expect(response.status()).toBe(200);
  });

  test('POST /api/testing/users creates a test user', async ({ request }) => {
    // First reset
    await request.delete('http://localhost:3000/api/testing/reset');

    // Create a test user
    const response = await request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.username).toBe('testuser');
    expect(data.name).toBe('Test User');
  });

  test('GET /api/me returns user info with valid token', async ({ request }) => {
    // Reset
    await request.delete('http://localhost:3000/api/testing/reset');

    // Create a user
    const userResponse = await request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      },
    });

    const userData = await userResponse.json();

    // Use the token to get user info
    const meResponse = await request.get('http://localhost:3000/api/me', {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    expect(meResponse.status()).toBe(200);
    const meData = await meResponse.json();
    expect(meData.username).toBe('testuser');
  });

  test('GET /api/me returns 401 with invalid token', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/me', {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });

    expect(response.status()).toBe(401);
  });
});
