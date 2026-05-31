export type ProfileFieldErrors = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
};

export type ProfileFormMessage = {
  type: "success" | "error";
  text: string;
};

export type ProfileEditFormState = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  loading: boolean;
  message: ProfileFormMessage | null;
  fieldErrors: ProfileFieldErrors;
};

export type ProfileEditFormAction =
  | { type: "set_first_name"; value: string }
  | { type: "set_last_name"; value: string }
  | { type: "set_date_of_birth"; value: string }
  | { type: "clear_field_error"; field: keyof ProfileFieldErrors }
  | { type: "submit_start" }
  | { type: "submit_validation_failed"; fieldErrors: ProfileFieldErrors }
  | { type: "submit_success"; message: ProfileFormMessage }
  | { type: "submit_error"; message: ProfileFormMessage }
  | { type: "submit_end" };

export function createInitialProfileEditFormState(args: {
  initialFirstName?: string | null;
  initialLastName?: string | null;
  initialDateOfBirth?: string | null;
}): ProfileEditFormState {
  return {
    firstName: args.initialFirstName ?? "",
    lastName: args.initialLastName ?? "",
    dateOfBirth: args.initialDateOfBirth ?? "",
    loading: false,
    message: null,
    fieldErrors: {},
  };
}

export function profileEditFormReducer(
  state: ProfileEditFormState,
  action: ProfileEditFormAction,
): ProfileEditFormState {
  switch (action.type) {
    case "set_first_name":
      return { ...state, firstName: action.value };
    case "set_last_name":
      return { ...state, lastName: action.value };
    case "set_date_of_birth":
      return { ...state, dateOfBirth: action.value };
    case "clear_field_error":
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.field]: undefined },
      };
    case "submit_start":
      return {
        ...state,
        loading: true,
        message: null,
        fieldErrors: {},
      };
    case "submit_validation_failed":
      return {
        ...state,
        loading: false,
        fieldErrors: action.fieldErrors,
      };
    case "submit_success":
      return {
        ...state,
        loading: false,
        message: action.message,
      };
    case "submit_error":
      return {
        ...state,
        loading: false,
        message: action.message,
      };
    case "submit_end":
      return { ...state, loading: false };
    default:
      return state;
  }
}
