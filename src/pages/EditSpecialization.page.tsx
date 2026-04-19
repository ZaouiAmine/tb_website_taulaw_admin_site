import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeading from "@/components/shared/PageHeading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { getSpecializationFormSchema } from "@/schemas/schemas";
import { useUpdateSpecializations } from "./specializations/queries";
import { getSpecializations } from "@/services/specializations";
import { useI18n } from "@/hooks/useI18n";

export default function EditSpecializationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentLanguage } = useI18n();
  const updateSpecializationMutation = useUpdateSpecializations();
  
  // Create dynamic schema based on current language
  const specializationFormSchema = getSpecializationFormSchema(currentLanguage);
  
  type SpecializationFormType = {
    english: string;
    arabic: string;
    french: string;
  };
  
  const form = useForm<SpecializationFormType>({
    resolver: zodResolver(specializationFormSchema),
    defaultValues: {
      english: "",
      arabic: "",
      french: "",
    },
  });

  useEffect(() => {
    const fetchSpecialization = async () => {
      if (!id) return;
      
      try {
        const response = await getSpecializations({ page: 1, limit: 1000, search: "" });
        const specialization = response.data?.flat().find((item: any) => item.id === id);
        
        if (specialization) {
          form.reset({
            english: specialization.nameEn || "",
            arabic: specialization.nameAr || "",
            french: specialization.nameFr || "",
          });
        }
      } catch (error) {
        console.error("Error fetching specialization:", error);
        toast.error(t("toasts.error.fetchFailed"));
      }
    };

    fetchSpecialization();
  }, [id, form, t]);

  async function onSubmit(values: SpecializationFormType) {
    if (!id) return;
    
    try {
      await updateSpecializationMutation.mutateAsync({
        id,
        data: {
          nameEn: values.english,
          nameAr: values.arabic,
          nameFr: values.french,
        },
      });
      navigate("/dropdown-management/specialization");
    } catch (error) {
      console.error("Error updating specialization:", error);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeading
        heading={t('pages.specialization.editTitle')}
        path={t('pages.specialization.path')}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 max-w-lg">
            <FormField
              control={form.control}
              name="english"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="english">{t('pages.specialization.columns.english')}</Label>
                  <FormControl>
                    <Input
                      id="english"
                      placeholder={t('forms.fields.enterNameEn')}
                      className="placeholder:text-sm placeholder:text-left border-none"
                      dir="rtl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arabic"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="arabic">{t('pages.specialization.columns.arabic')}</Label>
                  <FormControl>
                    <Input
                      id="arabic"
                      placeholder={t('forms.fields.enterNameAr')}
                      className="placeholder:text-sm placeholder:text-left border-none"
                      dir="rtl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="french"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="french">{t('pages.specialization.columns.french')}</Label>
                  <FormControl>
                    <Input
                      id="french"
                      placeholder={t('forms.fields.enterName')}
                      className="placeholder:text-sm placeholder:text-left border-none"
                      dir="rtl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 mt-10 w-full">
              <Button 
                className="p-6" 
                type="submit"
                disabled={updateSpecializationMutation.isPending}
              >
                {updateSpecializationMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("common.updating")}</span>
                  </div>
                ) : (
                  t('common.update')
                )}
              </Button>
              <Button 
                variant="outline" 
                className="p-6" 
                type="button"
                onClick={() => navigate("/dropdown-management/specialization")}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
