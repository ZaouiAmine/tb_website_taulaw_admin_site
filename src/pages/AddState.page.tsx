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
import { getStateFormSchema } from "@/schemas/schemas";
import { useCreateState } from "./states/queries";
import { useI18n } from "@/hooks/useI18n";

export default function AddStatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useI18n();
  const createStateMutation = useCreateState();

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

  function onSubmit(values: StateFormType) {
    createStateMutation.mutate(values, {
      onSuccess: () => {
        navigate("/admin/states");
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeading
        heading={t('pages.states.addTitle')}
        path={t('pages.states.path')}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 max-w-lg">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="nameEn">{t('pages.states.columns.english')}</Label>
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
                  <Label htmlFor="nameAr">{t('pages.states.columns.arabic')}</Label>
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
                  <Label htmlFor="nameFr">{t('pages.states.columns.french')}</Label>
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
                disabled={createStateMutation.isPending}
              >
                {createStateMutation.isPending ? (
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
                onClick={() => navigate("/admin/states")}
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
