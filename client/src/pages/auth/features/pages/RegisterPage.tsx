import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hook/UseCustomeRedux";
import { authTranslations } from "../../utils/i18n/authTranslations";
import type {
  AlertKind,
  FormData,
  FormErrors,
} from "../components/register/types";
import { createUser, getAllUsers } from "../../../../api/User.api";
import { usePasswordChecks } from "../components/register/hook/usePasswordChecks";
import { REGEX } from "../../../../constants/regex";
import type { IUser } from "../../../../utils/interface/Users";
import { ROUTES } from "../../../../constants/routes";
import AlertToast from "../components/register/AlertToast";
import RegisterHeader from "../components/register/RegisterHeader";
import RegisterForm from "../components/register/RegisterForm";
import { logo, logo_medium } from "../../../../export/exportImage";
import { clsx } from "clsx";
import StyledWrapper, { StyledWrapper4 } from "../../ui/StyledWrapper";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mode } = useAppSelector((s) => s.darkMode);
  const {
    listUsers,
    loading: usersLoading,
    error: usersError,
  } = useAppSelector((s) => s.user);
  const language = useAppSelector((s) => s.language.language);
  const { register: registerCopy, shared } = authTranslations[language];

  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertKind | null>(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const { checks: pwdChecks, isStrong: isPasswordStrong } = usePasswordChecks(
    formData.password
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as {
      name: keyof FormData;
      value: string;
    };
    const nextValue =
      name === "password" ? value : value.replace(/\s+/g, " ").trimStart();
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    const email = formData.email.trim();
    const username = formData.username.trim();

    if (!email) newErrors.email = registerCopy.errors.emailRequired;
    else if (!REGEX.EMAIL.test(email))
      newErrors.email = registerCopy.errors.emailInvalid;

    if (!username) newErrors.username = registerCopy.errors.usernameRequired;
    else if (username.length < 3)
      newErrors.username = registerCopy.errors.usernameShort;

    if (!formData.password)
      newErrors.password = registerCopy.errors.passwordRequired;
    else if (!isPasswordStrong)
      newErrors.password = registerCopy.errors.passwordPolicy;

    if (Object.keys(newErrors).length) return newErrors;

    const users: IUser[] = Array.isArray(listUsers) ? listUsers : [];
    if (users.some((u) => u.email?.toLowerCase() === email.toLowerCase()))
      newErrors.email = registerCopy.errors.emailTaken;
    if (
      users.some(
        (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
      )
    )
      newErrors.username = registerCopy.errors.usernameTaken;

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (usersLoading) {
      setAlert({
        type: "info",
        message: shared.loadingUsersTitle,
        description: shared.loadingUsersDescription,
      });
      return;
    }
    if (usersError) {
      setAlert({
        type: "error",
        message: shared.loadUsersFailedTitle,
        description: shared.loadUsersFailedDescription,
      });
      return;
    }

    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload: IUser = {
        id: Date.now(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password, // demo only
        created_at: new Date().toISOString(),
        favorites: [],
      };

      await dispatch(createUser(payload)).unwrap();

      setAlert({
        type: "success",
        message: registerCopy.alerts.successTitle,
        description: registerCopy.alerts.successDescription,
      });
      setTimeout(() => navigate(ROUTES.LOGIN), 700);
    } catch (error) {
      setAlert({
        type: "error",
        message: registerCopy.alerts.failedTitle,
        description:
          error instanceof Error
            ? `${registerCopy.alerts.failedDescription} (${error.message})`
            : registerCopy.alerts.failedDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // theme helpers (kept identical behavior)
  const fieldTheme = mode
    ? "bg-[#14161B] text-[#F2F2F2] placeholder-[#7C828C]"
    : "bg-white/80 text-slate-800 placeholder-slate-400";

  const borderByError = (hasErr: boolean) =>
    hasErr
      ? mode
        ? "border-[#B9384F] focus:ring-[#B9384F]/70"
        : "border-rose-400 focus:border-rose-400 focus:ring-rose-400/60"
      : mode
      ? "border-[#24262D] focus:border-[#D4AF37] focus:ring-[rgba(212,175,55,0.28)]"
      : "border-slate-200/70 focus:border-gray-400/60 focus:ring-gray-400/60";

  const borders = {
    email: borderByError(Boolean(errors.email)),
    username: borderByError(Boolean(errors.username)),
    password: borderByError(Boolean(errors.password)),
  } as const;

  return (
    <div className="w-full max-w-lg px-6 sm:px-5">
      <AlertToast mode={mode} alert={alert} onClose={() => setAlert(null)} />

      <div
        className={`rounded-3xl border p-8 shadow-2xl backdrop-blur-xl transition-colors duration-500 sm:p-10 ${
          mode
            ? "border-[rgba(232,201,113,0.25)] bg-[#14161B]/90 shadow-yellow-700"
            : "border-slate-200/70 bg-white/80"
        }`}
      >
        <RegisterHeader
          mode={mode}
          logoSrc={mode ? logo_medium : logo}
          heading={registerCopy.heading}
          subheading={registerCopy.subheading}
        />

        <RegisterForm
          mode={mode}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errors={errors}
          passwordChecks={pwdChecks}
          fieldTheme={fieldTheme}
          borders={borders}
          copy={{
            emailPlaceholder: registerCopy.emailPlaceholder,
            usernamePlaceholder: registerCopy.usernamePlaceholder,
            passwordPlaceholder: registerCopy.passwordPlaceholder,
            submit: registerCopy.submit,
            submitting: registerCopy.submitting,
          }}
        />

        <div className="mt-8 flex items-center justify-center">
          <p
            className={clsx(
              "text-sm transition-colors duration-300 flex items-center gap-2",
              mode ? "text-[#C9C9CF]" : "text-slate-600"
            )}
          >
            {registerCopy.prompt.text}
            {mode ? (
              <StyledWrapper4>
                <Link
                  to="/login"
                  className={`${
                    mode
                      ? "text-[#E8C971] hover:text-[#F5D27A]"
                      : "text-blue-500 hover:text-blue-800"
                  } font-semibold transition-colors duration-200 flex items-center gap-1 cta`}
                >
                  <span className="hover-underline-animation">
                    {registerCopy.prompt.cta}
                  </span>
                  <svg
                    id="arrow-horizontal"
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    height={10}
                    viewBox="0 0 46 16"
                  >
                    <path
                      id="Path_10"
                      data-name="Path 10"
                      d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                      transform="translate(30)"
                    />
                  </svg>
                </Link>
              </StyledWrapper4>
            ) : (
              <Link
                to="/login"
                className={`${
                  mode
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-blue-500 hover:text-blue-800"
                } font-semibold transition-colors duration-200`}
              >
                {registerCopy.prompt.cta}
              </Link>
            )}
          </p>
        </div>

        <div className="mt-8 text-center text-lg uppercase tracking-[0.2em] text-slate-500">
          {mode ? (
            <StyledWrapper>{shared.brandFooter}</StyledWrapper>
          ) : (
            shared.brandFooter
          )}
        </div>
      </div>
    </div>
  );
}
