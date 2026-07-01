export type SignInState = {
  currentIndex: number;
  email: string;
  isSubmitted: boolean;
  emailError: string;
  isSending: boolean;
  isGoogleLoading: boolean;
};

export type SignInAction =
  | { type: "set_email"; email: string }
  | { type: "clear_email_error" }
  | { type: "submit_start" }
  | { type: "submit_success" }
  | { type: "submit_error"; message: string }
  | { type: "google_start" }
  | { type: "google_error"; message: string }
  | { type: "reset_form" }
  | { type: "advance_carousel"; count: number };

export const initialSignInState: SignInState = {
  currentIndex: 0,
  email: "",
  isSubmitted: false,
  emailError: "",
  isSending: false,
  isGoogleLoading: false,
};

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function signInReducer(
  state: SignInState,
  action: SignInAction,
): SignInState {
  switch (action.type) {
    case "set_email":
      return { ...state, email: action.email, emailError: "" };
    case "clear_email_error":
      return { ...state, emailError: "" };
    case "submit_start":
      return { ...state, isSending: true, emailError: "" };
    case "submit_success":
      return { ...state, isSubmitted: true, isSending: false };
    case "submit_error":
      return { ...state, emailError: action.message, isSending: false };
    case "google_start":
      return { ...state, isGoogleLoading: true, emailError: "" };
    case "google_error":
      return { ...state, emailError: action.message, isGoogleLoading: false };
    case "reset_form":
      return {
        ...state,
        isSubmitted: false,
        email: "",
        emailError: "",
      };
    case "advance_carousel":
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % action.count,
      };
    default:
      return state;
  }
}
