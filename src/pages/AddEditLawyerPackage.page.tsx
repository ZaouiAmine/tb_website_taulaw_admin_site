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
import { useCreateLawyerPackage, useLawyerPackage, useUpdateLawyerPackage } from "@/hooks/useLawyerPackages";
import { lawyerPackageFormSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { type z } from "zod";
import { CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import PageHeading from "@/components/shared/PageHeading";
import { useTranslation } from "react-i18next";

type LawyerPackageFormValues = z.infer<typeof lawyerPackageFormSchema>;

const AddEditLawyerPackagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
const {t} = useTranslation();
  const { data: packageData, isLoading: isLoadingPackage } = useLawyerPackage(id as string, {
    enabled: isEditMode,
  });

  const createMutation = useCreateLawyerPackage({
    onSuccess: () => {
      navigate("/lawyer-packages");
    },
  });

  const updateMutation = useUpdateLawyerPackage({
    onSuccess: () => {
      navigate("/lawyer-packages");
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<LawyerPackageFormValues>({
    resolver: zodResolver(lawyerPackageFormSchema) as any,
    defaultValues: {
      name: "",
      numberOfCases: 0,
      numberOfAssistants: 0,
      price: 0,
      durationInDays: 30,
      isActive: true,
    },
  });

  useEffect(() => {
    if (packageData) {
      form.reset({
        name: packageData.name,
        numberOfCases: packageData.numberOfCases,
        numberOfAssistants: packageData.numberOfAssistants,
        price: packageData.price,
        durationInDays: packageData.durationInDays,
        isActive: packageData.isActive,
      });
    }
  }, [packageData, form]);

  const onSubmit = (data: LawyerPackageFormValues) => {
    if (isEditMode && id) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoadingPackage) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeading 
        heading={isEditMode ? t("lawyerPackages.addPage.createTitle") : t("lawyerPackages.addPage.createTitle")} 
        path={isEditMode ? t("lawyerPackages.addPage.breadcrumbAdd") : t("lawyerPackages.addPage.breadcrumbAdd")}
      />
      
      <div className="max-w-2xl pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lawyerPackages.addPage.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("lawyerPackages.addPage.namePlaceholder")} {...field} />
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
                  <FormLabel>{t("lawyerPackages.addPage.pricePlaceholder")}</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        step="any"
                        min={0} 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lawyerPackages.addPage.durationPlaceholder")}</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        min={0} 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfCases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lawyerPackages.addPage.numberOfCasesPlaceholder")}</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        min={0} 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfAssistants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lawyerPackages.addPage.numberOfAssistantsPlaceholder")}</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        min={0} 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
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
                    <FormLabel className="text-base">{t("lawyerPackages.addPage.isActivePlaceholder")}</FormLabel>
                    <CardDescription>
                      {t("lawyerPackages.addPage.isActiveDescription")}
                    </CardDescription>
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? t("lawyerPackages.addPage.updateButton") : t("lawyerPackages.addPage.createButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/lawyer-packages")}
                className="w-full sm:w-auto"
              >
                {t("lawyerPackages.addPage.cancelButton")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddEditLawyerPackagePage;
