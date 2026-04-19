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
import { getStateFormSchema } from "@/schemas/schemas";
import { useUpdateState } from "./states/queries";
import { getStates } from "@/services/states";
import { useI18n } from "@/hooks/useI18n";
import { PageLoader } from "@/components/shared/CustomClipLoader";

export default function EditStatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentLanguage } = useI18n();
  const updateStateMutation = useUpdateState();

  // Create dynamic schema based on current language
  const stateFormSchema = getStateFormSchema(currentLanguage);

  type StateFormType = {
    nameAr: string;
    nameEn: string;
    nameFr: string;
  };

  const form = useForm<StateFormType>({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      nameAr: "",
      nameEn: "",
      nameFr: "",
    },
  });

  useEffect(() => {
    const fetchState = async () => {
      if (!id) return;

      try {
        const response = await getStates({
          page: 1,
          limit: 1000,
          search: "",
        });
        const state = response.data.flat().find((item: any) => item.id === id);

        if (state) {
          form.reset({
            nameAr: state.nameAr,
            nameEn: state.nameEn,
            nameFr: state.nameFr,
          });
        } else {
          // State not found, redirect back
          navigate("/admin/states");
        }
      } catch (error) {
        navigate("/admin/states");
      }
    };

    fetchState();
  }, [id, form, navigate]);

  function onSubmit(values: StateFormType) {
    if (!id) return;

    updateStateMutation.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          navigate("/admin/states");
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
        heading={t("pages.states.editTitle")}
        path={t("pages.states.path")}
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
                    {t("pages.states.columns.english")}
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
                    {t("pages.states.columns.arabic")}
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
                    {t("pages.states.columns.french")}
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
                disabled={updateStateMutation.isPending}
              >
                {updateStateMutation.isPending ? (
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
                onClick={() => navigate("/admin/states")}
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
