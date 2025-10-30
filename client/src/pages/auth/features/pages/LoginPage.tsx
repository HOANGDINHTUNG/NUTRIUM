import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clsx } from "clsx";

import AlertToast from "../components/login/AlertToast";
import LogoHeader from "../components/login/LogoHeader";
import EmailField from "../components/login/EmailField";
import PasswordField from "../components/login/PasswordField";
import RememberMe from "../components/login/RememberMe";
import SubmitButton from "../components/login/SubmitButton";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hook/UseCustomeRedux";
import { authTranslations } from "../../utils/i18n/authTranslations";
import { getAllUsers } from "../../../../api/User.api";
import { REGEX } from "../../../../constants/regex";
import type { IUser } from "../../../../utils/interface/Users";
import { login } from "../../../../stores/slices/authSlice";
import { ROUTES } from "../../../../constants/routes";
import { StyledWrapper2, StyledWrapper4 } from "../../ui/StyledWrapper";
import { axiosInstance } from "../../../../utils/axiosInstance";

export type FormData = {
  email: string;
  password: string;
};

export type FormErrors = Partial<Record<keyof FormData, string>>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mode } = useAppSelector((state) => state.darkMode);
  const {
    listUsers,
    loading: usersLoading,
    error: usersError,
  } = useAppSelector((state) => state.user);
  const language = useAppSelector((state) => state.language.language);
  const { login: loginCopy, shared } = authTranslations[language];

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    try {
      return !!JSON.parse(localStorage.getItem("rememberMe") || "false");
    } catch {
      return false;
    }
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    try {
      const rememberedEmail = JSON.parse(
        localStorage.getItem("rememberedEmail") || "null"
      );
      if (typeof rememberedEmail === "string" && rememberedEmail) {
        setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const key = name as keyof FormData;
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = loginCopy.errors.emailRequired;
    else if (!REGEX.EMAIL.test(formData.email))
      newErrors.email = loginCopy.errors.emailInvalid;
    if (!formData.password)
      newErrors.password = loginCopy.errors.passwordRequired;
    return newErrors;
  };

  // Rút ra userId dưới dạng số từ chuỗi token
  const extractUserIdFromToken = (rawToken: string): number | null => {
    if (!rawToken) return null;

    // ép giá trị sáng số an toàn
    const coerceToNumber = (value: unknown): number | null => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : null;
    };

    try {
      const parsed = JSON.parse(rawToken);
      if (typeof parsed === "number" || typeof parsed === "string") {
        const numeric = coerceToNumber(parsed);
        if (numeric !== null) return numeric;
      }

      // kiểm tra object của parsed có khi là id hay không
      if (parsed && typeof parsed === "object" && "id" in parsed) {
        const numeric = coerceToNumber((parsed as Record<string, unknown>).id);
        if (numeric !== null) return numeric;
      }
    } catch {
      console.error("Error");
    }

    return coerceToNumber(rawToken);
  };

  const loginWithToken = async (tokenValue: string): Promise<boolean> => {
    const userId = extractUserIdFromToken(tokenValue);
    if (userId == null) {
      localStorage.removeItem("token");
      return false;
    }

    const users: IUser[] = Array.isArray(listUsers) ? listUsers : [];
    let matchedUser = users.find((user) => Number(user.id) === userId);

    if (!matchedUser) {
      try {
        const response = await axiosInstance.get<IUser>(`users/${userId}`);
        matchedUser = response.data;
        console.log(matchedUser);
      } catch (error) {
        console.error("Failed to sign in with stored token:", error);
        const tokenExpiredDescription =
          language === "vi"
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            : "Your session has expired. Please sign in again.";
        setAlert({
          type: "warning",
          message: loginCopy.alerts.failedTitle,
          description: tokenExpiredDescription,
        });
        localStorage.removeItem("token");
        return false;
      }
    }

    if (!matchedUser) {
      localStorage.removeItem("token");
      return false;
    }

    dispatch(login(matchedUser));
    const displayName = matchedUser.username || matchedUser.email;
    const successGreeting =
      language === "vi"
        ? `Chào mừng ${displayName}!`
        : `Welcome ${displayName}!`;
    setAlert({
      type: "success",
      message: loginCopy.alerts.successTitle,
      description: successGreeting,
    });

    setTimeout(() => navigate(ROUTES.HOME), 600);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailInput = (formData.email || "").trim();
    const passwordInput = (formData.password || "").trim();
    const hasEmail = emailInput.length > 0;
    const hasPassword = passwordInput.length > 0;

    // ƯU TIÊN ĐĂNG NHẬP BẰNG INPUT NẾU NGƯỜI DÙNG CÓ NHẬP
    if (hasEmail || hasPassword) {
      // Nếu chỉ nhập 1 trong 2 → báo lỗi ngay
      const partialErrors: FormErrors = {};
      if (!hasEmail) partialErrors.email = loginCopy.errors.emailRequired;
      if (!hasPassword)
        partialErrors.password = loginCopy.errors.passwordRequired;

      if (!hasEmail || !hasPassword) {
        setErrors(partialErrors);
        setAlert({
          type: "error",
          message: loginCopy.alerts.failedTitle,
          description: loginCopy.alerts.missingFieldsDescription,
        });
        return;
      }

      // Validate full
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Cần users để kiểm tra credential
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

      // Đăng nhập bằng input (bỏ qua token nếu có)
      setIsLoading(true);
      try {
        const users: IUser[] = Array.isArray(listUsers) ? listUsers : [];
        const found = users.find(
          (user) =>
            String(user.email).toLowerCase() === emailInput.toLowerCase() &&
            (user as IUser).password === passwordInput
        );

        if (!found) {
          setErrors({ password: loginCopy.errors.credentials });
          setAlert({
            type: "error",
            message: loginCopy.alerts.failedTitle,
            description: loginCopy.alerts.failedDescription,
          });
          return;
        }

        // Remember me
        try {
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", JSON.stringify(emailInput));
            localStorage.setItem("rememberMe", JSON.stringify(true));
          } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.setItem("rememberMe", JSON.stringify(false));
          }
        } catch (error) {
          console.error("Error : ", error);
        }

        // Lưu trạng thái đăng nhập
        dispatch(login(found));

        // Lưu token (id)
        try {
          localStorage.setItem("token", JSON.stringify(found.id));
        } catch (error) {
          console.error("Failed to persist auth token:", error);
        }

        const displayName = found.username || found.email;
        const successGreeting =
          language === "vi"
            ? `Chào mừng ${displayName}!`
            : `Welcome ${displayName}!`;
        setAlert({
          type: "success",
          message: loginCopy.alerts.successTitle,
          description: successGreeting,
        });

        setTimeout(() => navigate(ROUTES.HOME), 600);
      } finally {
        setIsLoading(false);
      }

      return; 
    }

    // KHÔNG NHẬP GÌ → THỬ ĐĂNG NHẬP BẰNG TOKEN (NẾU CÓ)
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoading(true);
      const tokenLoggedIn = await loginWithToken(storedToken);
      setIsLoading(false);
      if (tokenLoggedIn) return;
    }

    // KHÔNG INPUT & KHÔNG TOKEN → BẮT LỖI
    setAlert({
      type: "error",
      message: loginCopy.alerts.failedTitle,
      description:
        language === "vi"
          ? "Vui lòng nhập email và mật khẩu hoặc đăng nhập lại để tiếp tục."
          : "Please enter your email & password or sign in again to continue.",
    });
    setErrors({
      email: loginCopy.errors.emailRequired,
      password: loginCopy.errors.passwordRequired,
    });
  };

  // shared classes
  const themeField = mode
    ? "bg-[#14161B] text-[#F2F2F2] placeholder-[#7C828C]"
    : "bg-white/80 text-slate-800 placeholder-slate-400";

  const emailBorder = errors.email
    ? mode
      ? "border-[#B9384F] focus:ring-[#B9384F]/70"
      : "border-rose-400 focus:border-rose-400 focus:ring-rose-400/60"
    : mode
    ? "border-[#24262D] focus:border-[#D4AF37] focus:ring-[rgba(212,175,55,0.28)]"
    : "border-slate-200/70 focus:border-gray-400/60 focus:ring-gray-400/60";

  const passBorder = errors.password
    ? mode
      ? "border-[#B9384F] focus:ring-[#B9384F]/70"
      : "border-rose-400 focus:border-rose-400 focus:ring-rose-400/60"
    : mode
    ? "border-[#24262D] focus:border-[#D4AF37] focus:ring-[rgba(212,175,55,0.28)]"
    : "border-slate-200/70 focus:border-gray-400/60 focus:ring-gray-400/60";

  return (
    <div className={`w-full max-w-lg px-6 sm:px-5`}>
      <AlertToast mode={mode} alert={alert} onClose={() => setAlert(null)} />

      <div
        className={`rounded-3xl border p-8 shadow-2xl backdrop-blur-xl transition-colors duration-500 sm:p-10 
          ${
            mode
              ? "border-[rgba(232,201,113,0.25)] bg-[#14161B]/90 shadow-yellow-700"
              : "border-slate-200/70 bg-white/80"
          }
        `}
      >
        <LogoHeader mode={mode} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <EmailField
            mode={mode}
            value={formData.email}
            onChange={handleChange}
            placeholder={loginCopy.emailPlaceholder}
            error={errors.email}
            themeField={themeField}
            borderClass={emailBorder}
          />

          <PasswordField
            mode={mode}
            value={formData.password}
            onChange={handleChange}
            placeholder={loginCopy.passwordPlaceholder}
            error={errors.password}
            show={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
            themeField={themeField}
            borderClass={passBorder}
            shared={shared}
          />

          <div className="flex items-center justify-between">
            <RememberMe
              mode={mode}
              checked={rememberMe}
              label={loginCopy.rememberMe}
              onChange={setRememberMe}
            />
          </div>

          <SubmitButton
            mode={mode}
            disabled={isLoading}
            text={loginCopy.submit}
            submittingText={loginCopy.submitting}
          />
        </form>

        <div className="mt-8 flex items-center justify-center">
          <div
            className={clsx(
              "text-sm transition-colors duration-300 flex items-center gap-2",
              mode ? "text-[#C9C9CF]" : "text-slate-600"
            )}
          >
            {loginCopy.prompt.text}
            {mode ? (
              <StyledWrapper4>
                <Link
                  to="/register"
                  className={`${
                    mode
                      ? "text-[#E8C971] hover:text-[#F5D27A]"
                      : "text-blue-500 hover:text-blue-800"
                  } font-semibold transition-colors duration-200 flex items-center gap-1 cta`}
                >
                  <span className="hover-underline-animation">
                    {loginCopy.prompt.cta}
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
                to="/register"
                className={`${
                  mode
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-blue-500 hover:text-blue-800"
                } font-semibold transition-colors duration-200`}
              >
                {loginCopy.prompt.cta}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-lg uppercase tracking-[0.2em] transition-colors duration-300 text-slate-500">
          {mode ? (
            <StyledWrapper2>
              <p className="txt">{shared.brandFooter}</p>
            </StyledWrapper2>
          ) : (
            shared.brandFooter
          )}
        </div>
      </div>
    </div>
  );
}
