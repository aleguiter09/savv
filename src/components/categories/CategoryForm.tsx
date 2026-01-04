"use client";
import type { Category } from "@/types/global.types";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CategorySchema } from "@/lib/schemas";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import z from "zod";
import { useToastStore } from "@/stores/toast-store";

type Schema = z.infer<typeof CategorySchema>;

export const CategoryForm = ({ category }: { category?: Category }) => {
  const t = useTranslations("categories");
  const show = useToastStore((store) => store.show);
  const [pending, startTransition] = useTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(CategorySchema),
    mode: "onBlur",
    defaultValues: {
      title: category?.title ?? "",
      icon: category?.icon ?? "",
      color: category?.color ?? undefined,
      parent_id: category?.parent_id ?? undefined,
    },
  });

  function onSubmit(data: Schema) {
    startTransition(async () => {
      console.log("data", data);
      show({ type: "success", message: "Category created successfully!" });
      // Handle form submission here
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="rounded-md p-4 flex flex-col gap-2">
        <FieldGroup className="mb-2">
          {/* Account name */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="title"
                  className="block text-sm font-medium"
                >
                  {t("title")}
                </FieldLabel>
                <Input
                  {...field}
                  id="title"
                  type="text"
                  className="w-full"
                  placeholder={t("titlePlaceholder")}
                  value={field.value}
                />
                {fieldState.invalid && (
                  <FieldError error={t(fieldState.error?.message as string)} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button loading={pending} type="submit">
          {t("createCategory")}
        </Button>
      </Card>
    </form>
  );
};
