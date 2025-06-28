"use client";
import { useFormState } from "react-dom";
import { updateMovementForm } from "@/utils/actions/movement-action";
import { useState } from "react";
import { Type } from "@/types/general";
import { Movement } from "@/types/database";
import { MovementForm } from "./MovementForm";

type Props = Readonly<{
  movement: Movement;
}>;

export function EditMovementForm({ movement }: Props) {
  const [state, dispatch] = useFormState(updateMovementForm, {
    message: null,
    errors: {},
  });
  const [date, setDate] = useState<Date | undefined>(
    new Date(movement.done_at)
  );
  const [type, setType] = useState<Type>(movement.type);
  const [category, setCategory] = useState<string>(
    movement?.category?.toString() ?? ""
  );
  const [from, setFrom] = useState<string>(movement.from.toString());
  const [where, setWhere] = useState<string>(movement.where?.toString() ?? "");

  const submit = (formData: FormData) => {
    formData.set("id", movement.id?.toString() ?? "");
    formData.set("previousAmount", movement.amount.toString());
    formData.set("previousFrom", movement.from.toString());
    formData.set("previousWhere", movement.where?.toString() ?? "");
    formData.set("previousType", movement.type);
    formData.set("done_at", date ? date.toISOString() : "");
    formData.set("type", type);
    formData.set("from", from);
    formData.set("category", category);

    if (type === "transfer") {
      formData.set("where", where);
      formData.delete("category");
    }

    dispatch(formData);
  };

  return (
    <form action={submit}>
      <MovementForm
        movement={movement}
        state={state}
        date={date}
        setDate={setDate}
        type={type}
        setType={setType}
        category={category}
        setCategory={setCategory}
        from={from}
        setFrom={setFrom}
        where={where}
        setWhere={setWhere}
      />
    </form>
  );
}
