import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import CustomClipLoader from "@/components/shared/CustomClipLoader";
import { LoginSchema } from "@/schemas/schemas";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Languages, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type AdminLoginFormValues = z.infer<typeof LoginSchema>;

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
];

export default function Login() {
  const { login, isLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    Cookies.set("i18nextLng", languageCode, {
      expires: 365,
      sameSite: "strict",
      path: "/",
    });
  };

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const onSubmit = async (credentials: AdminLoginFormValues) => {
    try {
      await login(credentials);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Set form error if login fails
      setError("root", {
        type: "manual",
        message: error.message || t("auth.loginFailed"),
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-muted">
      <div className="mx-auto w-11/12 sm:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 min-h-dvh max-h-dvh h-dvh flex items-center justify-center">
        <div className="w-full">
          <Card className="px-10 py-12 rounded-4xl border-none flex flex-col gap-6 relative">
            {/* Language Switcher */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Languages className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {i18n.language === "ar" ? "العربية" : "English"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`flex items-center justify-between ${
                        i18n.language === language.code ? "bg-muted" : ""
                      }`}
                    >
                      <span>{language.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {language.nativeName}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardHeader className="p-0">
              <h2 className="font-bold text-4xl capitalize text-center flex items-center gap-2 justify-center mb-2">
                {t("auth.signIn")}
              </h2>
              <p className="text-muted-foreground text-sm text-center">
                {t("auth.loginDescription")}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className=" flex flex-col gap-4"
              >
                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input
                    placeholder={t("auth.enterEmail")}
                    id="email"
                    className="py-6"
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message || ""}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      className={`py-6 ${i18n.language === "ar" ? "pl-12" : "pr-12"}`}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.enterPassword")}
                      {...register("password")}
                      aria-invalid={!!errors.password}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${
                        i18n.language === "ar" ? "left-0" : "right-0"
                      }`}
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message || ""}
                    </p>
                  )}
                </div>

                {errors.root && (
                  <p className="text-xs text-destructive text-center">
                    {errors.root.message}
                  </p>
                )}

                <Button
                  type="submit"
                  variant={"default"}
                  className="w-full capitalize py-6 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? <CustomClipLoader /> : t("auth.login")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
