"use server";
import { revalidatePath } from "next/cache";
import {
  deleteMovement,
  insertMovement,
  updateMovement,
} from "@/modules/movements/services/movements";
import {
  applyMovementNow,
  cancelSeries,
} from "@/modules/movements/services/movement-series";
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
  revalidatePath("/analytics");
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
  revalidatePath("/analytics");
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
  revalidatePath("/analytics");
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
  revalidatePath("/analytics");
  return { success: true };
};

export const cancelSeriesForm = async (
  seriesId: number,
): Promise<ServerActionResponse> => {
  if (!seriesId) {
    return { success: false, error: "validationError" };
  }

  try {
    await cancelSeries(seriesId);
  } catch {
    return {
      success: false,
      error: "cancelSeriesDatabaseError",
    };
  }

  revalidatePath("/home");
  revalidatePath("/movements");
  revalidatePath("/analytics");
  return { success: true };
};
