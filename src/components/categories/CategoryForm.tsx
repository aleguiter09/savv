import { FormCategoryState } from "@/types/general";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const CategoryForm = ({ state }: { state: FormCategoryState }) => {
  const t = useTranslations("categories");
  const { errors } = state;
  const { pending } = useFormStatus();

  return (
    <Card className="rounded-md p-4 flex flex-col gap-2">
      <Input
        type="text"
        name="title"
        placeholder={t("titlePlaceholder")}
        label={t("title")}
        className="w-full"
        error={errors?.title?.[0] && t(errors.title[0])}
      />

      <Button loading={pending} type="submit">
        {t("createCategory")}
      </Button>
    </Card>
  );
};
