import { test, expect } from '@playwright/test';

test('abre e fecha todas as operações e modelos do contrato', async ({ page }) => {
  await page.goto('/api/docs/');
  const operations = page.locator('.opblock-summary-control');
  await expect(operations.first()).toBeVisible();
  expect(await operations.count()).toBeGreaterThan(1);
  for (const control of await operations.all()) {
    await control.click();
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    await control.click();
    await expect(control).toHaveAttribute('aria-expanded', 'false');
  }
  for (const control of await page.locator('.model-box-control').all()) {
    await control.click();
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    await control.click();
    await expect(control).toHaveAttribute('aria-expanded', 'false');
  }
});

for (const width of [320, 390, 768, 1440]) {
  test(`documentação utilizável em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/api/docs/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('API de Tarefas');
    const health = page.locator('#operations-Sistema-get_api_health');
    await health.locator('.opblock-summary-control').click();
    await health.getByRole('button', { name: 'Try it out' }).click();
    await health.getByRole('button', { name: 'Execute', exact: true }).click();
    await expect(health.locator('.responses-wrapper')).toContainText('"status": "ok"');
    const first = page.locator('.opblock-summary-control').first();
    await first.focus();
    await page.keyboard.press('Shift');
    expect(await first.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.getByRole('button', { name: 'TaskInput', exact: true }).click();
    await expect(page.locator('.models')).toContainText('title');
  });
}
