"use client";
import { createCategoryForm } from "@/utils/actions/category-action";
import { useFormState } from "react-dom";
import { CategoryForm } from "./CategoryForm";

export function CreateCategoryForm() {
  const [state, dispatch] = useFormState(createCategoryForm, {
    message: null,
    errors: {},
  });

  return (
    <form action={dispatch}>
      <CategoryForm state={state} />
    </form>
  );
}
