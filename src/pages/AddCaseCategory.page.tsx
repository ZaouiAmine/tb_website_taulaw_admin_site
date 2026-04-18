import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeading from "@/components/shared/PageHeading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { getCaseCategoryFormSchema } from "@/schemas/schemas";
import { useCreateCaseCategory } from "./caseCategories/queries";
import { useI18n } from "@/hooks/useI18n";

export default function AddCaseCategoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useI18n();
  const createCaseCategoryMutation = useCreateCaseCategory();

  // Create dynamic schema based on current language
  const caseCategoryFormSchema = getCaseCategoryFormSchema(currentLanguage);
  
  type CaseCategoryFormType = {
    nameAr: string;
    nameEn: string;
    nameFr: string;
  };

  const form = useForm<CaseCategoryFormType>({
    resolver: zodResolver(caseCategoryFormSchema),
    defaultValues: {
      nameAr: "",
      nameEn: "",
      nameFr: "",
    },
  });

  function onSubmit(values: CaseCategoryFormType) {
    createCaseCategoryMutation.mutate(values, {
      onSuccess: () => {
        navigate("/dropdown-management/case-category");
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeading
        heading={t('pages.caseCategory.addTitle')}
        path={t('pages.caseCategory.path')}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 max-w-lg">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="nameEn">{t('pages.caseCategory.columns.english')}</Label>
                  <FormControl>
                    <Input
                      id="nameEn"
                      placeholder={t('forms.fields.enterNameEn')}
                      className="placeholder:text-sm placeholder:text-left border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="nameAr">{t('pages.caseCategory.columns.arabic')}</Label>
                  <FormControl>
                    <Input
                      id="nameAr"
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
              name="nameFr"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="nameFr">{t('pages.caseCategory.columns.french')}</Label>
                  <FormControl>
                    <Input
                      id="nameFr"
                      placeholder={t('forms.fields.enterName')}
                      className="placeholder:text-sm placeholder:text-left border-none"
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
                disabled={createCaseCategoryMutation.isPending}
              >
                {createCaseCategoryMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("common.saving")}</span>
                  </div>
                ) : (
                  t('common.save')
                )}
              </Button>
              <Button 
                variant="outline" 
                className="p-6" 
                type="button"
                onClick={() => navigate("/dropdown-management/case-category")}
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
