"use client";
import { useFormState } from "react-dom";
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import { createMovementForm } from "@/utils/actions/movement-action";
import { MovementForm } from "./MovementForm";
import { MovementTypes } from "@/types/global.types";

export function CreateMovementForm() {
  const { accounts } = useData();
  const defaultAcc = accounts.find((a) => a.default);

  const [state, dispatch] = useFormState(createMovementForm, {
    message: null,
    errors: {},
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<MovementTypes>("expense");
  const [category, setCategory] = useState<string>("");
  const [from, setFrom] = useState<string>(defaultAcc?.id?.toString() ?? "");
  const [where, setWhere] = useState<string>("");

  const submit = (formData: FormData) => {
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
