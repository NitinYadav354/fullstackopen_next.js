import { Page } from '@playwright/test';

export async function loginUser(
  page: Page,
  username: string,
  password: string
) {
  await page.goto('/login');
  await page.fill('input[placeholder*="Username"]', username);
  await page.fill('input[placeholder*="Password"]', password);
  await page.click('button:has-text("Login")');
  await page.waitForURL('/');
}

export async function registerUser(
  page: Page,
  name: string,
  username: string,
  password: string
) {
  await page.goto('/register');
  await page.fill('input[placeholder*="Name"]', name);
  await page.fill('input[placeholder*="Username"]', username);
  await page.fill('input[placeholder*="Password"]', password);
  await page.click('button:has-text("Register")');
  await page.waitForURL('/');
}

export async function createBlog(
  page: Page,
  title: string,
  author: string,
  url: string
) {
  await page.goto('/blogs/new');
  await page.fill('input[placeholder*="Title"]', title);
  await page.fill('input[placeholder*="Author"]', author);
  await page.fill('input[placeholder*="URL"]', url);
  await page.click('button:has-text("Create")');
  await page.waitForURL('/blogs');
}

export async function logout(page: Page) {
  await page.click('button:has-text("Logout")');
  await page.waitForURL('/');
}
