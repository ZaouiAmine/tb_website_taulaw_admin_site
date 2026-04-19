import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeading from "@/components/shared/PageHeading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { getSpecializationFormSchema } from "@/schemas/schemas";
import { useCreateSpecializations } from "./specializations/queries";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";

export default function AddSpecializationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useI18n();
  const createSpecializationMutation = useCreateSpecializations();
  
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

  async function onSubmit(values: SpecializationFormType) {
    try {
      await createSpecializationMutation.mutateAsync({
        nameEn: values.english,
        nameAr: values.arabic,
        nameFr: values.french,
      });
      navigate("/dropdown-management/specialization");
    } catch (error) {
      console.error("Error creating specialization:", error);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeading
        heading={t('pages.specialization.addTitle')}
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
              <Button className="p-6" type="submit">
                {t('common.save')}
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
