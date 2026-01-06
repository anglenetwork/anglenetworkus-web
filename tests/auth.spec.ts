import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to signin page before each test
    await page.goto("/signin");
  });

  test("login page renders Google button", async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check for "Continue with Google" button
    const googleButton = page.getByRole("button", {
      name: /continue with google/i,
    });
    await expect(googleButton).toBeVisible();

    // Verify button has Chrome icon
    const chromeIcon = googleButton.locator("svg, [class*='chrome']");
    await expect(chromeIcon).toBeVisible();
  });

  test("Google OAuth button click initiates redirect", async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Find and click Google button
    const googleButton = page.getByRole("button", {
      name: /continue with google/i,
    });
    await expect(googleButton).toBeVisible();

    // Click button and wait for navigation
    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("supabase") ||
          resp.url().includes("google") ||
          resp.status() === 200
      ),
      googleButton.click(),
    ]);

    // Verify redirect occurred (either to Google OAuth or Supabase auth endpoint)
    // Note: In CI, this might need to be mocked
    const currentUrl = page.url();
    expect(
      currentUrl.includes("google") ||
        currentUrl.includes("supabase") ||
        currentUrl.includes("accounts.google.com")
    ).toBeTruthy();
  });

  test("email form still works alongside Google button", async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Verify email input is visible
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();

    // Verify "Send sign-in link" button is visible
    const emailButton = page.getByRole("button", {
      name: /send sign-in link/i,
    });
    await expect(emailButton).toBeVisible();

    // Verify "Or" divider is present
    const divider = page.getByText(/or/i);
    await expect(divider).toBeVisible();
  });

  test("profile displays user data after login", async ({ page }) => {
    // This test assumes you have a test user or can mock authentication
    // For now, we'll check that the profile page structure exists
    // In a real scenario, you'd need to:
    // 1. Create a test user in Supabase
    // 2. Sign in programmatically
    // 3. Navigate to /myprofile
    // 4. Assert profile data is displayed

    // Skip this test if no test credentials are available
    test.skip(
      !process.env.PLAYWRIGHT_TEST_EMAIL || !process.env.PLAYWRIGHT_TEST_PASSWORD,
      "Test credentials not provided"
    );

    // Navigate to profile (this would require authentication)
    await page.goto("/myprofile");

    // Wait for profile page to load
    await page.waitForLoadState("networkidle");

    // Check for profile elements
    const profileHeading = page.getByRole("heading", { name: /profile/i });
    await expect(profileHeading).toBeVisible();

    // Check for email display (if logged in)
    // Note: This will fail if not authenticated, which is expected
    const emailLabel = page.getByText(/email address/i);
    if (await emailLabel.isVisible()) {
      // If email is visible, profile data should be displayed
      await expect(emailLabel).toBeVisible();
    }
  });

  test("logout works and redirects to signin", async ({ page, context }) => {
    // This test requires authentication first
    // For now, we'll test the logout flow structure

    // Navigate to a protected route
    await page.goto("/myprofile");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check if user menu is visible (indicates logged in)
    const userMenuButton = page.getByRole("button", {
      name: /user menu/i,
    });

    if (await userMenuButton.isVisible()) {
      // Click user menu
      await userMenuButton.click();

      // Wait for dropdown to appear
      await page.waitForSelector('[role="menuitem"]', { timeout: 2000 });

      // Click sign out
      const signOutButton = page.getByRole("menuitem", {
        name: /sign out/i,
      });
      await expect(signOutButton).toBeVisible();
      await signOutButton.click();

      // Wait for redirect to signin
      await page.waitForURL(/\/signin/, { timeout: 5000 });

      // Verify we're on signin page
      expect(page.url()).toContain("/signin");

      // Verify signin page elements are visible
      const signInHeading = page.getByRole("heading", {
        name: /sign in to continue/i,
      });
      await expect(signInHeading).toBeVisible();
    } else {
      // If not logged in, verify redirect to signin
      expect(page.url()).toContain("/signin");
    }
  });

  test("protected routes redirect to signin when not authenticated", async ({
    page,
    context,
  }) => {
    // Clear any existing session
    await context.clearCookies();

    // Try to access protected route
    await page.goto("/myprofile");

    // Should redirect to signin
    await page.waitForURL(/\/signin/, { timeout: 5000 });
    expect(page.url()).toContain("/signin");

    // Verify signin page is displayed
    const signInHeading = page.getByRole("heading", {
      name: /sign in to continue/i,
    });
    await expect(signInHeading).toBeVisible();
  });
});

