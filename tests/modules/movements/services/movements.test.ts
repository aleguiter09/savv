import { beforeEach, describe, expect, it, vi } from "vitest";

const { queryMock, selectMock, fromMock } = vi.hoisted(() => {
  const query = {
    eq: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
  };

  query.eq.mockReturnValue(query);
  query.gte.mockReturnValue(query);
  query.lte.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.range.mockResolvedValue({
    data: [
      {
        id: 1,
        amount: -45.5,
        description: "Supermercado",
        balance_after: 954.5,
        type: "expense",
        done_at: "2026-08-10T10:00:00.000Z",
        from: 1,
        applied: true,
        fullCategory: {
          id: 10,
          title: "Comida",
          icon: "shopping-cart",
          color: "green",
          is_global: true,
          is_custom_name: false,
        },
      },
    ],
    count: 45,
  });

  const select = vi.fn().mockReturnValue(query);
  const from = vi.fn().mockReturnValue({ select });

  return { queryMock: query, selectMock: select, fromMock: from };
});

vi.mock("@/infra/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: fromMock,
  }),
}));

import { getMovementsByFilters } from "@/modules/movements/services/movements";

describe("getMovementsByFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryMock.eq.mockReturnValue(queryMock);
    queryMock.gte.mockReturnValue(queryMock);
    queryMock.lte.mockReturnValue(queryMock);
    queryMock.order.mockReturnValue(queryMock);
    queryMock.range.mockResolvedValue({
      data: [
        {
          id: 1,
          amount: -45.5,
          description: "Supermercado",
          balance_after: 954.5,
          type: "expense",
          done_at: "2026-08-10T10:00:00.000Z",
          from: 1,
          applied: true,
          fullCategory: {
            id: 10,
            title: "Comida",
            icon: "shopping-cart",
            color: "green",
            is_global: true,
            is_custom_name: false,
          },
        },
      ],
      count: 45,
    });
    selectMock.mockReturnValue(queryMock);
    fromMock.mockReturnValue({ select: selectMock });
  });

  it("applies range for page 1 with default page size", async () => {
    const from = new Date("2026-08-01T00:00:00.000Z");
    const to = new Date("2026-08-31T23:59:59.999Z");

    const result = await getMovementsByFilters(from, to, "all", "all", 1, 30);

    expect(queryMock.range).toHaveBeenCalledWith(0, 29);
    expect(result.total).toBe(45);
    expect(result.data).toHaveLength(1);
  });

  it("applies range for page 2", async () => {
    const from = new Date("2026-08-01T00:00:00.000Z");
    const to = new Date("2026-08-31T23:59:59.999Z");

    await getMovementsByFilters(from, to, "all", "all", 2, 30);

    expect(queryMock.range).toHaveBeenCalledWith(30, 59);
  });

  it("applies account and category filters before pagination", async () => {
    const from = new Date("2026-08-01T00:00:00.000Z");
    const to = new Date("2026-08-31T23:59:59.999Z");

    await getMovementsByFilters(from, to, "3", "expenses", 1, 30);

    expect(queryMock.eq).toHaveBeenCalledWith("from", 3);
    expect(queryMock.eq).toHaveBeenCalledWith("type", "expense");
    expect(queryMock.range).toHaveBeenCalledWith(0, 29);
  });
});
