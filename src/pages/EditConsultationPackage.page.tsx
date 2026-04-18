import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import PageHeading from "@/components/shared/PageHeading";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import {
  useConsultationPackage,
  useUpdateConsultationPackage,
} from "./consultationPackages/queries";

export default function EditConsultationPackagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const updatePackageMutation = useUpdateConsultationPackage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: packageData, isLoading } = useConsultationPackage(id || "");

  const formSchema = z.object({
    name: z.string().min(1, t("pages.consultationPackages.validation.nameRequired")),
    numberOfConsultations: z.number().min(1, t("pages.consultationPackages.validation.numberOfConsultationsRequired")),
    price: z.number().min(0, t("pages.consultationPackages.validation.priceRequired")),
    isActive: z.boolean(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      numberOfConsultations: 1,
      price: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (packageData) {
      form.reset({
        name: packageData.name,
        numberOfConsultations: Number(packageData.numberOfConsultations),
        price: Number(packageData.price),
        isActive: packageData.isActive,
      });
    }
  }, [packageData, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updatePackageMutation.mutateAsync({ id, data: values });
      navigate("/admin/consultation-packages");
    } catch (error) {
      console.error("Error updating consultation package:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader message={t("common.loading")} />;
  }

  if (!packageData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t("messages.noData")}</p>
      </div>
    );
  }

  return (
    <>
      <PageHeading
        heading={t("pages.consultationPackages.editTitle")}
        path={t("pages.consultationPackages.path")}
      />

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("pages.consultationPackages.fields.name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t(
                        "pages.consultationPackages.fields.enterName"
                      )}
                      className="text-base p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfConsultations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("pages.consultationPackages.fields.numberOfConsultations")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      step="1"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                      placeholder={t(
                        "pages.consultationPackages.fields.enterNumberOfConsultations"
                      )}
                      className="text-base p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("pages.consultationPackages.fields.price")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                      placeholder={t(
                        "pages.consultationPackages.fields.enterPrice"
                      )}
                      className="text-base p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("pages.consultationPackages.fields.isActive")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/consultation-packages")}
                className="flex-1 p-6 text-base"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 p-6 text-base"
              >
                {isSubmitting ? t("common.updating") : t("common.update")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
