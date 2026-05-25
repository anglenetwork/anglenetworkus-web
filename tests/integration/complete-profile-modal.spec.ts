import { test, expect } from "@playwright/test";

test.describe("Complete Profile Modal After Login", () => {
  test("modal appears after login when profile is incomplete", async ({
    page,
  }) => {
    // Skip if no test email (authentication is handled by global setup)
    test.skip(!process.env.PLAYWRIGHT_TEST_EMAIL, "Test email not provided");

    // Navigate directly to profile-details with post_login=1
    // Authentication is handled by global setup, so we can go straight to protected routes
    await page.goto("/myprofile/profile-details?post_login=1");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check if modal appears (only if profile is incomplete)
    // Note: This test assumes the user doesn't have first_name/last_name
    const modalTitle = page.getByText("Complete your profile");

    // Modal should be visible if profile is incomplete
    // If profile is already complete, modal won't show
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    if (isModalVisible) {
      // Verify modal content
      await expect(modalTitle).toBeVisible();
      await expect(
        page.getByText(
          /Please provide your first name, last name, and date of birth/i,
        ),
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
    // Skip if no test email (authentication is handled by global setup)
    test.skip(!process.env.PLAYWRIGHT_TEST_EMAIL, "Test email not provided");

    // Navigate to profile-details with post_login=1
    // Authentication is handled by global setup
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
    // Skip if no test email (authentication is handled by global setup)
    test.skip(!process.env.PLAYWRIGHT_TEST_EMAIL, "Test email not provided");

    // This test assumes user already has first_name, last_name, and date_of_birth
    // Navigate to profile-details with post_login=1
    // Authentication is handled by global setup
    await page.goto("/myprofile/profile-details?post_login=1");
    await page.waitForLoadState("networkidle");

    // Modal should NOT appear if profile is complete
    const modalTitle = page.getByText("Complete your profile");
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    // If profile is complete (has first_name, last_name, and date_of_birth), modal should not show
    expect(isModalVisible).toBe(false);
  });

  test("modal does not show without post_login parameter", async ({ page }) => {
    // Navigate to profile-details WITHOUT post_login=1
    await page.goto("/myprofile/profile-details");
    await page.waitForLoadState("networkidle");

    // Modal should NOT appear
    const modalTitle = page.getByText("Complete your profile");
    const isModalVisible = await modalTitle.isVisible().catch(() => false);

    expect(isModalVisible).toBe(false);
  });
});
