"use server";
import { revalidatePath } from "next/cache";
import {
  deleteMovement,
  insertMovement,
  updateMovement,
} from "@/modules/movements/services/movements";
import { redirect } from "next/navigation";
import { setToastMessage } from "@/modules/shared/actions/toast";
import { getTranslations } from "next-intl/server";
import { MovementSchema } from "@/modules/shared/utils/schemas";
import { z } from "zod";
import { ServerActionResponse } from "@/modules/shared/types/global.types";
import { MovementView } from "../types/types";

export const createMovementForm = async (
  data: z.infer<typeof MovementSchema>,
): Promise<ServerActionResponse> => {
  const parsed = MovementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to create the movement",
    };
  }

  try {
    await insertMovement(parsed.data);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to insert movement: " + error,
    };
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/");
  redirect("/");
};

export const deleteMovementForm = async (movement: MovementView) => {
  if (!movement.id || !movement.account?.id) return;

  await deleteMovement(movement.id);

  const t = await getTranslations("movements");

  setToastMessage("success", t("deletedSuccess"));
  revalidatePath("/");
  redirect("/");
};

export const updateMovementForm = async (
  previous: MovementView,
  data: z.infer<typeof MovementSchema>,
): Promise<ServerActionResponse> => {
  const parsed = MovementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to update movement",
    };
  }

  try {
    await updateMovement(parsed.data, Number(previous.id));
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to update movement: " + error,
    };
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("updatedSuccess"));
  revalidatePath("/");
  redirect("/");
};
