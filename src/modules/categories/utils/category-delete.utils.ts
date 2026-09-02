export function getCategoryDeleteBlockReason(input: {
  isGlobal: boolean;
  movementCount: number;
  seriesCount: number;
  childCount: number;
}): string | null {
  if (input.isGlobal) {
    return "globalCategoryError";
  }

  if (input.movementCount > 0) {
    return "hasMovementsError";
  }

  if (input.seriesCount > 0) {
    return "hasSeriesError";
  }

  if (input.childCount > 0) {
    return "hasSubcategoriesError";
  }

  return null;
}
