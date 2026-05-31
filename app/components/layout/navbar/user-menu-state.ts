import type { User } from "@supabase/supabase-js";

export type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";

export type UserMenuState = {
  user: User | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  avatarImageStatus: AvatarImageStatus;
  loading: boolean;
  signingOut: boolean;
};

export type UserMenuAction =
  | { type: "session_loaded"; session: { user: User } | null }
  | { type: "session_sync"; session: { user: User } | null }
  | { type: "profile_loaded"; firstName: string | null; lastName: string | null }
  | { type: "avatar_status"; status: AvatarImageStatus }
  | { type: "sign_out_start" }
  | { type: "sign_out_complete" }
  | { type: "signed_out" };

export const initialUserMenuState: UserMenuState = {
  user: null,
  firstName: null,
  lastName: null,
  avatarUrl: null,
  avatarImageStatus: "idle",
  loading: true,
  signingOut: false,
};

function avatarStateForUser(user: User | null): Pick<
  UserMenuState,
  "avatarUrl" | "avatarImageStatus"
> {
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  return {
    avatarUrl,
    avatarImageStatus: avatarUrl ? "loading" : "idle",
  };
}

export function userMenuReducer(
  state: UserMenuState,
  action: UserMenuAction,
): UserMenuState {
  switch (action.type) {
    case "session_loaded": {
      const user = action.session?.user ?? null;
      return {
        ...state,
        user,
        loading: false,
        firstName: user ? state.firstName : null,
        lastName: user ? state.lastName : null,
        ...avatarStateForUser(user),
      };
    }
    case "session_sync": {
      const user = action.session?.user ?? null;
      return {
        ...state,
        user,
        loading: false,
        firstName: user ? state.firstName : null,
        lastName: user ? state.lastName : null,
        ...avatarStateForUser(user),
      };
    }
    case "profile_loaded":
      return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
      };
    case "avatar_status":
      return { ...state, avatarImageStatus: action.status };
    case "sign_out_start":
      return { ...state, signingOut: true };
    case "sign_out_complete":
      return { ...state, signingOut: false };
    case "signed_out":
      return {
        ...state,
        user: null,
        firstName: null,
        lastName: null,
        avatarUrl: null,
        avatarImageStatus: "idle",
        signingOut: false,
      };
    default:
      return state;
  }
}
