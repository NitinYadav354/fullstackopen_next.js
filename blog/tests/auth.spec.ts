import { test, expect } from '@playwright/test';
import { registerUser, loginUser, logout } from './utils';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database before each test
    await page.request.delete('http://localhost:3000/api/testing/reset');
  });

  test('user can register', async ({ page }) => {
    await registerUser(page, 'Test User', 'testuser', 'password123');
    await expect(page).toHaveURL('/');
    // Check if navbar shows user info
    await expect(page.locator('text=testuser')).toBeVisible();
  });

  test('user can login', async ({ page }) => {
    // First create a user via API
    await page.request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      },
    });

    await loginUser(page, 'testuser', 'password123');
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=testuser')).toBeVisible();
  });

  test('user can logout', async ({ page }) => {
    // First create and login a user
    await page.request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      },
    });

    await loginUser(page, 'testuser', 'password123');
    await logout(page);

    // After logout, user should not see logout button
    await expect(page.locator('button:has-text("Logout")')).not.toBeVisible();
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder*="Username"]', 'nonexistent');
    await page.fill('input[placeholder*="Password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');

    // Should see error notification
    await expect(page.locator('[data-testid="notification"]')).toBeVisible();
  });
});
