import { test, expect } from '@playwright/test';
import { registerUser, loginUser, createBlog } from './utils';

test.describe('Blogs', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database before each test
    await page.request.delete('http://localhost:3000/api/testing/reset');
  });

  test('user can create a blog', async ({ page }) => {
    // Register and login
    await registerUser(page, 'Test User', 'testuser', 'password123');

    // Create a blog
    await createBlog(
      page,
      'Test Blog Title',
      'Test Author',
      'https://example.com'
    );

    // Should see the blog in the list
    await expect(page.locator('text=Test Blog Title')).toBeVisible();
  });

  test('blog appears in /blogs page', async ({ page }) => {
    // Create a user and blog
    await page.request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      },
    });

    await loginUser(page, 'testuser', 'password123');
    await createBlog(
      page,
      'My Test Blog',
      'Test Author',
      'https://example.com'
    );

    // Navigate to /blogs
    await page.goto('/blogs');
    await expect(page.locator('text=My Test Blog')).toBeVisible();
  });

  test('user can add blog to reading list', async ({ page }) => {
    // Create two users
    await page.request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Author User',
        username: 'author',
        password: 'password123',
      },
    });

    await page.request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Reader User',
        username: 'reader',
        password: 'password123',
      },
    });

    // Author creates a blog
    await loginUser(page, 'author', 'password123');
    await createBlog(page, 'Article', 'Author', 'https://example.com');

    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/');

    // Reader logs in and tries to add blog to reading list
    await loginUser(page, 'reader', 'password123');
    await page.goto('/blogs');
    await page.click('button:has-text("Add to reading list")');

    // Should see success notification
    await expect(page.locator('[data-testid="notification"]')).toBeVisible();
  });

  test('user can view their reading list', async ({ page }) => {
    // Create user
    await page.request.post('http://localhost:3000/api/testing/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      },
    });

    // Login and create a blog
    await loginUser(page, 'testuser', 'password123');
    await createBlog(page, 'Test Blog', 'Author', 'https://example.com');

    // Navigate to /me (profile/reading list page)
    await page.goto('/me');
    await expect(page.locator('text=Test Blog')).toBeVisible();
  });
});
