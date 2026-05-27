import { vi } from "vitest";
import type { PostgrestError } from "@supabase/supabase-js";

export function mockPostgrestError(
  partial: Partial<PostgrestError> & Pick<PostgrestError, "message">,
): PostgrestError {
  return {
    message: partial.message,
    details: partial.details ?? "",
    hint: partial.hint ?? "",
    code: partial.code ?? "",
    name: partial.name ?? "PostgrestError",
  };
}

export function mockRpcSuccess() {
  return {
    data: null,
    error: null,
    count: null,
    status: 200,
    statusText: "OK",
  };
}

export function mockRpcError(error: PostgrestError) {
  return {
    data: null,
    error,
    count: null,
    status: 400,
    statusText: "Bad Request",
  };
}

export function mockFromLimitProbe(error: PostgrestError | null) {
  return {
    select: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({
      data: null,
      error,
      count: null,
      status: error ? 400 : 200,
      statusText: error ? "Bad Request" : "OK",
    }),
  };
}
