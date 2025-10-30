export type FormData = {
  email: string;
  username: string;
  password: string;
};

export type FormErrors = Partial<Record<keyof FormData, string>>;

export type AlertKind = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  description?: string;
};
