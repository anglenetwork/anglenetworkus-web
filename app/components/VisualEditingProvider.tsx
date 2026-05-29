"use client";

import { VisualEditing } from "@sanity/visual-editing/react";

export function VisualEditingProvider() {
  return <VisualEditing portal={true} />;
}

export default VisualEditingProvider;
