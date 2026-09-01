"use server";
import { revalidatePath } from "next/cache";
import {
  deleteMovement,
  insertMovement,
  updateMovement,
} from "@/modules/movements/services/movements";
import { applyMovementNow } from "@/modules/movements/services/movement-series";
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
      error: "validationError",
    };
  }

  try {
    await insertMovement(parsed.data);
  } catch {
    return {
      success: false,
      error: "createDatabaseError",
    };
  }

  revalidatePath("/home");
  return { success: true };
};

export const deleteMovementForm = async (
  movementId: number,
): Promise<ServerActionResponse> => {
  if (!movementId) {
    return { success: false, error: "validationError" };
  }

  try {
    await deleteMovement(movementId);
  } catch {
    return {
      success: false,
      error: "deleteDatabaseError",
    };
  }

  revalidatePath("/home");
  revalidatePath("/movements");
  return { success: true };
};

export const updateMovementForm = async (
  previous: MovementView,
  data: z.infer<typeof MovementSchema>,
): Promise<ServerActionResponse> => {
  const parsed = MovementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "validationError",
    };
  }

  try {
    const shouldUpdateSeries =
      Boolean(previous.seriesId) && previous.applied === false;

    await updateMovement(parsed.data, Number(previous.id), {
      seriesId: previous.seriesId,
      updateSeries: shouldUpdateSeries,
    });
  } catch {
    return {
      success: false,
      error: "updateDatabaseError",
    };
  }

  revalidatePath("/home");
  return { success: true };
};

export const applyMovementNowForm = async (
  movementId: number,
): Promise<ServerActionResponse> => {
  try {
    await applyMovementNow(movementId);
  } catch {
    return {
      success: false,
      error: "applyDatabaseError",
    };
  }

  revalidatePath("/home");
  return { success: true };
};
