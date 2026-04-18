import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PageHeading from "@/components/shared/PageHeading";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import { BannerStatusSwitch } from "@/components/ui/BannerStatusSwitch";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { useUpdateBanner, useBanner } from "./banners/queries";
import { isValidHttpUrl } from "@/utils/validation";
import i18n from "@/i18n";

const createBannerFormSchema = (t: (key: string) => string) =>
  z.object({
    image: z.string().optional(),
    link: z
      .string()
      .min(1, t("pages.banners.validation.linkRequired"))
      .refine((url) => isValidHttpUrl(url), {
        message: t("pages.banners.validation.linkInvalid"),
      }),
    type: z.enum(["lawyer", "client"]),
  });

export default function EditBannerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const updateBannerMutation = useUpdateBanner();

  const { data: banner, isLoading, error } = useBanner(id || "");

  const bannerFormSchema = createBannerFormSchema(t);
  type BannerFormType = z.infer<typeof bannerFormSchema>;

  const form = useForm<BannerFormType>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      image: "",
      link: "",
      type: "lawyer",
    },
  });

  const watchedImage = form.watch("image");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    if (banner) {
      form.reset({
        link: banner.link,
        type: (banner as any).type || "lawyer",
      });
      const imageUrl = banner.image.startsWith("http")
        ? banner.image
        : `${import.meta.env.VITE_API_BASE_URL}${banner.image}`;
      setImagePreview(imageUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStatus((banner as any).status === "inactive" ? "inactive" : "active");
    }
  }, [banner, form]);

  const compressImage = (
    file: File,
    maxWidth: number = 800,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        const base64String = compressedBase64.split(",")[1];
        resolve(base64String);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setHasNewImage(true);
      setIsCompressing(true);

      try {
        const compressedBase64 = await compressImage(file, 800, 0.7);
        const previewUrl = `data:image/jpeg;base64,${compressedBase64}`;
        setImagePreview(previewUrl);
        form.setValue("image", compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Error processing image. Please try a different image.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image", "");
    setImagePreview(null);
    setHasNewImage(true);
  };

  function onSubmit(values: BannerFormType) {
    if (!id) return;

    if (!imagePreview && !values.image) {
      form.setError("image", { type: "manual", message: "Image is required" });
      return;
    }

    const bannerData = {
      image: hasNewImage ? values.image || null : null,
      link: values.link,
      status,
      type: values.type,
    } as any;

    updateBannerMutation.mutate(
      { id, data: bannerData },
      {
        onSuccess: () => {
          navigate("/admin/banners");
        },
      }
    );
  }

  if (isLoading) {
    return <PageLoader message={t("common.loading")} />;
  }

  if (error || !banner) {
    return <PageLoader message={t("common.error")} />;
  }

  return (
    <div className="space-y-6">
      <PageHeading
        heading={t("pages.banners.editTitle")}
        path={t("pages.banners.path")}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-700">
                {t("pages.banners.fields.image")}
              </Label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-gray-600">
                    Drag & Drop Your Files Or{" "}
                    <span className="text-black font-medium">Browse</span>
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={isCompressing}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-block px-4 py-2 text-sm sm:text-base text-white rounded cursor-pointer transition-colors ${
                      isCompressing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    {isCompressing ? "Compressing..." : "Choose File"}
                  </label>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Max size: 5MB (will be compressed automatically)
                  </p>
                </div>
              </div>

              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full h-32 sm:h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-32 sm:h-40 rounded-lg border grid place-items-center text-sm text-gray-500">
                    {t("pages.banners.validation.imageRequired")}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base hover:bg-orange-600 transition-colors"
                >
                  ×
                </button>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    {imagePreview
                      ? "Upload Complete"
                      : t("pages.banners.validation.imageRequired")}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                    {t("common.type")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className={`flex flex-row gap-4 ${i18n.language === "ar" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lawyer" id="lawyer" />
                        <Label htmlFor="lawyer" className="cursor-pointer">
                          {t("common.lawyer")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="client" id="client" />
                        <Label htmlFor="client" className="cursor-pointer">
                          {t("common.client")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label className="text-sm sm:text-base font-medium text-gray-700">
                {t("pages.banners.fields.status")}
              </Label>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <BannerStatusSwitch
                  checked={status === "active"}
                  disabled={false}
                  onCheckedChange={(checked) => setStatus(checked ? "active" : "inactive")}
                />
                <span className="text-xs sm:text-sm text-gray-600">
                  {status === "active" ? t("pages.banners.status.active") : t("pages.banners.status.inactive")}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm sm:text-base font-medium text-gray-700">
                    {t("pages.banners.fields.link")}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t("pages.banners.fields.enterLink")}
                      className="placeholder:text-xs sm:placeholder:text-sm placeholder:text-left border-none text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 w-full">
              <Button
                className="p-4 sm:p-6 text-sm sm:text-base"
                type="submit"
                disabled={
                  updateBannerMutation.isPending ||
                  (!imagePreview && !watchedImage)
                }
              >
                {updateBannerMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("common.updating")}</span>
                  </div>
                ) : (
                  t("common.update")
                )}
              </Button>
              <Button
                variant="outline"
                className="p-4 sm:p-6 text-sm sm:text-base"
                type="button"
                onClick={() => navigate("/admin/banners")}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
