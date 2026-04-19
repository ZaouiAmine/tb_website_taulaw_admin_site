import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeading from "@/components/shared/PageHeading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { getCaseCategoryFormSchema } from "@/schemas/schemas";
import { useUpdateCaseCategory } from "./caseCategories/queries";
import { getCaseCategories } from "@/services/caseCategories";
import { useI18n } from "@/hooks/useI18n";
import { PageLoader } from "@/components/shared/CustomClipLoader";

export default function EditCaseCategoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentLanguage } = useI18n();
  const updateCaseCategoryMutation = useUpdateCaseCategory();

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

  useEffect(() => {
    const fetchCaseCategory = async () => {
      if (!id) return;

      try {
        const response = await getCaseCategories({ page: 1, limit: 1000, search: "" });
        const caseCategory = response.data.flat().find(item => item.id === id);
        
        if (caseCategory) {
          form.reset({
            nameAr: caseCategory.nameAr,
            nameEn: caseCategory.nameEn,
            nameFr: caseCategory.nameFr,
          });
        } else {
          navigate("/dropdown-management/case-category");
        }
      } catch (error) {
        console.error("Error fetching case category:", error);
        navigate("/dropdown-management/case-category");
      }
    };

    fetchCaseCategory();
  }, [id, form, navigate]);

  function onSubmit(values: CaseCategoryFormType) {
    if (!id) return;

    updateCaseCategoryMutation.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          navigate("/dropdown-management/case-category");
        },
      }
    );
  }

  if (!id) {
    return <PageLoader message={t("common.loading")} />;
  }

  return (
    <div className="space-y-6">
      <PageHeading
        heading={t('pages.caseCategory.editTitle')}
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
                disabled={updateCaseCategoryMutation.isPending}
              >
                {updateCaseCategoryMutation.isPending ? (
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
