import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useCreateConsultationPackage } from "./consultationPackages/queries";

export default function AddConsultationPackagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createPackageMutation = useCreateConsultationPackage();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await createPackageMutation.mutateAsync(values);
      navigate("/admin/consultation-packages");
    } catch (error) {
      console.error("Error creating consultation package:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeading
        heading={t("pages.consultationPackages.title")}
        path={t("pages.consultationPackages.path")}
      />

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-lg font-medium mb-4">
              {t("pages.consultationPackages.form.packageDetails")}
            </h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("pages.consultationPackages.form.packageName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("pages.consultationPackages.form.namePlaceholder")}
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
                    {t("pages.consultationPackages.form.numberOfConsultations")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      step="1"
                      placeholder={t("pages.consultationPackages.form.consultationsPlaceholder")}
                      className="text-base p-6"
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      min="0"
                      step="0.01"
                      placeholder={t("pages.consultationPackages.form.pricePlaceholder")}
                      className="text-base p-6"
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      {t("pages.consultationPackages.form.isActive")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {field.value
                          ? t("pages.consultationPackages.active")
                          : t("pages.consultationPackages.inactive")}
                      </label>
                    </div>
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
                {isSubmitting ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
