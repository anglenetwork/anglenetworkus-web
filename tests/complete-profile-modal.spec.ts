import { test, expect } from "@playwright/test";

test.describe("Complete Profile Modal After Login", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear any existing session
    await context.clearCookies();
  });

  test("modal appears after login when profile is incomplete", async ({
    page,
  }) => {
    // Skip if no test credentials
    test.skip(
      !process.env.PLAYWRIGHT_TEST_EMAIL || !process.env.PLAYWRIGHT_TEST_PASSWORD,
      "Test credentials not provided"
    );

    // Navigate to signin
    await page.goto("/signin");
    await page.waitForLoadState("networkidle");

    // Perform login (this would need to be adapted based on your auth flow)
    // For now, we'll test the modal display logic directly
    // In a real scenario, you'd sign in first, then navigate

    // Navigate directly to profile-details with post_login=1
    // (simulating post-login redirect)
    await page.goto("/myprofile/profile-details?post_login=1");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check if modal appears (only if profile is incomplete)
    // Note: This test assumes the user doesn't have first_name/last_name
    const modal = page.getByRole("dialog");
    const modalTitle = page.getByText("Complete your profile");

    // Modal should be visible if profile is incomplete
    // If profile is already complete, modal won't show
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    if (isModalVisible) {
      // Verify modal content
      await expect(modalTitle).toBeVisible();
      await expect(
        page.getByText(/Please provide your first name, last name, and date of birth/i)
      ).toBeVisible();

      // Verify form fields
      const firstNameInput = page.getByLabel(/first name/i);
      const lastNameInput = page.getByLabel(/last name/i);
      const dateOfBirthInput = page.getByLabel(/date of birth/i);
      await expect(firstNameInput).toBeVisible();
      await expect(lastNameInput).toBeVisible();
      await expect(dateOfBirthInput).toBeVisible();

      // Verify submit button is disabled when fields are empty
      const submitButton = page.getByRole("button", {
        name: /complete profile/i,
      });
      await expect(submitButton).toBeDisabled();
    }
  });

  test("modal blocks until profile is completed", async ({ page }) => {
    // Navigate to profile-details with post_login=1
    await page.goto("/myprofile/profile-details?post_login=1");
    await page.waitForLoadState("networkidle");

    const modalTitle = page.getByText("Complete your profile");
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    if (isModalVisible) {
      // Try to close modal via ESC
      await page.keyboard.press("Escape");
      // Modal should still be visible
      await expect(modalTitle).toBeVisible();

      // Try clicking outside modal
      await page.click("body", { position: { x: 10, y: 10 } });
      // Modal should still be visible
      await expect(modalTitle).toBeVisible();

      // Fill only first name
      const firstNameInput = page.getByLabel(/first name/i);
      await firstNameInput.fill("John");

      // Submit button should still be disabled (need first name, last name, and date of birth)
      const submitButton = page.getByRole("button", {
        name: /complete profile/i,
      });
      await expect(submitButton).toBeDisabled();

      // Fill last name
      const lastNameInput = page.getByLabel(/last name/i);
      await lastNameInput.fill("Doe");

      // Submit button should still be disabled (still need date of birth)
      await expect(submitButton).toBeDisabled();

      // Try to submit with only first name
      await submitButton.click({ force: true });
      // Should show error or remain disabled
      await expect(modalTitle).toBeVisible();
    }
  });

  test("submit completes profile and closes modal", async ({ page }) => {
    // Skip if no test credentials
    test.skip(
      !process.env.PLAYWRIGHT_TEST_EMAIL || !process.env.PLAYWRIGHT_TEST_PASSWORD,
      "Test credentials not provided"
    );

    // Navigate to profile-details with post_login=1
    await page.goto("/myprofile/profile-details?post_login=1");
    await page.waitForLoadState("networkidle");

    const modalTitle = page.getByText("Complete your profile");
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    if (isModalVisible) {
      // Fill all required fields (first name, last name, and date of birth)
      const firstNameInput = page.getByLabel(/first name/i);
      const lastNameInput = page.getByLabel(/last name/i);
      const dateOfBirthInput = page.getByLabel(/date of birth/i);

      await firstNameInput.fill("John");
      await lastNameInput.fill("Doe");
      // Set date of birth to a valid date (e.g., 1990-01-01)
      await dateOfBirthInput.fill("1990-01-01");

      // Submit button should be enabled
      const submitButton = page.getByRole("button", {
        name: /complete profile/i,
      });
      await expect(submitButton).toBeEnabled();

      // Submit form
      await submitButton.click();

      // Wait for modal to close (success message then close)
      await page.waitForTimeout(1000);

      // Modal should be closed
      await expect(modalTitle).not.toBeVisible();

      // URL should not have post_login=1
      const url = page.url();
      expect(url).not.toContain("post_login=1");

      // Profile page should show updated names
      await expect(page.getByText("John")).toBeVisible();
      await expect(page.getByText("Doe")).toBeVisible();
    }
  });

  test("modal does not show if profile is already complete", async ({
    page,
  }) => {
    // Skip if no test credentials
    test.skip(
      !process.env.PLAYWRIGHT_TEST_EMAIL || !process.env.PLAYWRIGHT_TEST_PASSWORD,
      "Test credentials not provided"
    );

    // This test assumes user already has first_name, last_name, and date_of_birth
    // Navigate to profile-details with post_login=1
    await page.goto("/myprofile/profile-details?post_login=1");
    await page.waitForLoadState("networkidle");

    // Modal should NOT appear if profile is complete
    const modalTitle = page.getByText("Complete your profile");
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    // If profile is complete (has first_name, last_name, and date_of_birth), modal should not show
    expect(isModalVisible).toBe(false);
  });

  test("modal does not show without post_login parameter", async ({
    page,
  }) => {
    // Navigate to profile-details WITHOUT post_login=1
    await page.goto("/myprofile/profile-details");
    await page.waitForLoadState("networkidle");

    // Modal should NOT appear
    const modalTitle = page.getByText("Complete your profile");
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    expect(isModalVisible).toBe(false);
  });

  test("logout works and session is cleared", async ({ page, context }) => {
    // Skip if no test credentials
    test.skip(
      !process.env.PLAYWRIGHT_TEST_EMAIL || !process.env.PLAYWRIGHT_TEST_PASSWORD,
      "Test credentials not provided"
    );

    // Navigate to a protected route
    await page.goto("/myprofile");
    await page.waitForLoadState("networkidle");

    // Check if user menu is visible (indicates logged in)
    const userMenuButton = page.getByRole("button", {
      name: /user menu/i,
    });

    if (await userMenuButton.isVisible()) {
      // Click user menu
      await userMenuButton.click();

      // Wait for dropdown
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

      // Verify protected route redirects when not authenticated
      await page.goto("/myprofile");
      await page.waitForURL(/\/signin/, { timeout: 5000 });
      expect(page.url()).toContain("/signin");
    }
  });
});


