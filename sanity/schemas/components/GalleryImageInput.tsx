"use client";

import { ObjectInputProps } from "sanity";
import { Button, Flex, Stack } from "@sanity/ui";
import { CloseIcon } from "@sanity/icons";
import { useCallback, useEffect } from "react";

/**
 * Custom input component for gallery images that adds a "Close/Save" button at the bottom.
 * The modal will automatically save changes when closed.
 */
export function GalleryImageInput(props: ObjectInputProps) {
  // Render the default object input
  const DefaultObjectInput = props.renderDefault(props);

  const handleClose = useCallback(() => {
    // In Sanity Studio, modals are managed by the framework.
    // Find the modal's close button and click it programmatically.

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Find the modal dialog
      const modal = document.querySelector('[role="dialog"]');

      if (modal) {
        // Look for the close button - it's typically in the header
        // Sanity Studio uses a specific structure for dialog headers
        const header =
          modal.querySelector("header") ||
          modal.querySelector('[data-ui="DialogHeader"]');

        if (header) {
          // The close button is usually the last button in the header
          const buttons = header.querySelectorAll("button");
          if (buttons.length > 0) {
            // Try the last button first (usually the close button)
            const lastButton = buttons[buttons.length - 1] as HTMLButtonElement;
            // Check if it has an icon (close buttons usually have SVG icons)
            if (lastButton.querySelector("svg")) {
              lastButton.click();
              return;
            }
          }
        }

        // Alternative: Look for button with close icon anywhere in modal
        const allButtons = modal.querySelectorAll("button");
        for (const button of Array.from(allButtons)) {
          const svg = button.querySelector("svg");
          // Close buttons are usually small and have icons
          if (svg && button.getBoundingClientRect().width < 60) {
            button.click();
            return;
          }
        }
      }

      // Fallback: Dispatch Escape key event to close modal
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escapeEvent);
    });
  }, []);

  return (
    <Stack space={4}>
      {DefaultObjectInput}
      <Flex
        justify="flex-start"
        padding={3}
        style={{ borderTop: "1px solid var(--card-border-color)" }}
      >
        <Button
          icon={CloseIcon}
          text="Save"
          tone="primary"
          onClick={handleClose}
        />
      </Flex>
    </Stack>
  );
}
