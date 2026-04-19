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
import { getCasePhaseFormSchema } from "@/schemas/schemas";
import { useUpdateCasePhase } from "./casePhases/queries";
import { getCasePhases } from "@/services/casePhases";
import { useI18n } from "@/hooks/useI18n";
import { PageLoader } from "@/components/shared/CustomClipLoader";

export default function EditCasePhasePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentLanguage } = useI18n();
  const updateCasePhaseMutation = useUpdateCasePhase();

  // Create dynamic schema based on current language
  const casePhaseFormSchema = getCasePhaseFormSchema(currentLanguage);
  
  type CasePhaseFormType = {
    nameAr: string;
    nameEn: string;
    nameFr: string;
  };

  const form = useForm<CasePhaseFormType>({
    resolver: zodResolver(casePhaseFormSchema),
    defaultValues: {
      nameAr: "",
      nameEn: "",
      nameFr: "",
    },
  });

  // Fetch case phase data for editing
  useEffect(() => {
    const fetchCasePhase = async () => {
      if (!id) return;

      try {
        const response = await getCasePhases({
          page: 1,
          limit: 1000,
          search: "",
        });
        const casePhase = response.data.flat().find((item) => item.id === id);

        if (casePhase) {
          form.reset({
            nameAr: casePhase.nameAr,
            nameEn: casePhase.nameEn,
            nameFr: casePhase.nameFr,
          });
        } else {
          // Case phase not found, redirect back
          navigate("/dropdown-management/case-phase");
        }
      } catch (error) {
        navigate("/dropdown-management/case-phase");
      }
    };

    fetchCasePhase();
  }, [id, form, navigate]);

  function onSubmit(values: CasePhaseFormType) {
    if (!id) return;

    updateCasePhaseMutation.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          navigate("/dropdown-management/case-phase");
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
        heading={t("pages.casePhase.editTitle")}
        path={t("pages.casePhase.path")}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 max-w-lg">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="nameEn">
                    {t("pages.casePhase.columns.english")}
                  </Label>
                  <FormControl>
                    <Input
                      id="nameEn"
                      placeholder={t("forms.fields.enterNameEn")}
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
                  <Label htmlFor="nameAr">
                    {t("pages.casePhase.columns.arabic")}
                  </Label>
                  <FormControl>
                    <Input
                      id="nameAr"
                      placeholder={t("forms.fields.enterNameAr")}
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
                  <Label htmlFor="nameFr">
                    {t("pages.casePhase.columns.french")}
                  </Label>
                  <FormControl>
                    <Input
                      id="nameFr"
                      placeholder={t("forms.fields.enterName")}
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
                disabled={updateCasePhaseMutation.isPending}
              >
                {updateCasePhaseMutation.isPending ? (
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
                className="p-6"
                type="button"
                onClick={() => navigate("/dropdown-management/case-phase")}
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
