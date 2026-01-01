
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateMovementForm } from './movement-action';
import { updateMovement } from '@/services/movements';
import { updateAccountBalances } from '@/services/accounts';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { setToastMessage } from '@/lib/toast';

// Mock dependencies
vi.mock('@/services/movements', () => ({
  updateMovement: vi.fn(),
  insertMovement: vi.fn(),
  deleteMovement: vi.fn(),
}));

vi.mock('@/services/accounts', () => ({
  updateAccountBalances: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/toast', () => ({
  setToastMessage: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

describe('updateMovementForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const baseFormData = {
        amount: "100",
        done_at: "2023-01-01",
        comment: "Test movement",
        from: "1",
        type: "expense",
        category: "1" 
    };

    const createFormData = (data: Record<string, string>) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));
        return formData;
    };

    it('should update an expense correctly and update balances (same amount, no balance change)', async () => {
        const formData = createFormData({
            ...baseFormData,
            id: "10",
            previousAmount: "100",
            previousFrom: "1",
            previousWhere: "0",
            previousType: "expense",
            // New values
            amount: "100",
            from: "1",
            type: "expense",
            category: "1"
        });

        await updateMovementForm({}, formData);

        expect(updateMovement).toHaveBeenCalled();
        expect(updateAccountBalances).not.toHaveBeenCalled();
    });

    it('should update balances when amount changes for expense', async () => {
        const formData = createFormData({
            ...baseFormData,
            id: "10",
            previousAmount: "100",
            previousFrom: "1",
            previousWhere: "0",
            previousType: "expense",
            // New values
            amount: "150",
            from: "1",
            type: "expense",
            category: "1"
        });

        await updateMovementForm({}, formData);

        expect(updateAccountBalances).toHaveBeenCalledWith([
            { account_id: 1, amount_change: -50 }
        ]);
    });

    it('should update balances when moving expense to another account', async () => {
        const formData = createFormData({
            ...baseFormData,
            id: "10",
            previousAmount: "100",
            previousFrom: "1",
            previousWhere: "0",
            previousType: "expense",
            // New values
            amount: "100",
            from: "2", 
            type: "expense",
            category: "1"
        });

        await updateMovementForm({}, formData);

        expect(updateAccountBalances).toHaveBeenCalledWith(expect.arrayContaining([
            { account_id: 2, amount_change: -100 },
            { account_id: 1, amount_change: 100 }
        ]));
    });

    it('should handle type change: Expense to Income', async () => {
        const formData = createFormData({
            ...baseFormData,
            id: "10",
            previousAmount: "100",
            previousFrom: "1",
            previousWhere: "0",
            previousType: "expense",
            // New values
            amount: "100",
            from: "1",
            type: "income",
            category: "1"
        });

        await updateMovementForm({}, formData);

        expect(updateAccountBalances).toHaveBeenCalledWith([
            { account_id: 1, amount_change: 200 }
        ]);
    });

    it('should handle type change: Transfer to Expense', async () => {
        const formData = createFormData({
            ...baseFormData,
            id: "10",
            previousAmount: "100",
            previousFrom: "1",
            previousWhere: "2",
            previousType: "transfer",
            // New values - Override base
            amount: "100",
            from: "1",
            type: "expense",
            category: "1",
            // Remove where if present in base? Base is expense, so no where.
            done_at: "2023-01-01",
            comment: "Test"
        });

        await updateMovementForm({}, formData);

        expect(updateAccountBalances).toHaveBeenCalledWith([
            { account_id: 2, amount_change: -100 }
        ]);
    });

    it('should handle type change: Expense to Transfer', async () => {
        const formData = createFormData({
            ...baseFormData,
            id: "10",
            previousAmount: "100",
            previousFrom: "1",
            previousWhere: "0",
            previousType: "expense",
            // New values
            amount: "100",
            from: "1",
            where: "2",
            type: "transfer",
            // category ignored for transfer usually, but schema might complain if specific fields mismatch?
            // Schema: TransferSchema = Base.extend({ type: literal 'transfer', where: ... })
            // It does NOT have category.
            // But if I pass category, safeparse might strip it or ignore it unless strict.
            // Zod 'object' strips unknown by default.
            // But if it's discriminative union...
            // TransferSchema does NOT have category.
            // I should NOT pass category for Transfer if I wanna be safe, or Zod strips it.
            // Let's pass it and see if Zod strips (default behavior).
        });

        await updateMovementForm({}, formData);

        expect(updateAccountBalances).toHaveBeenCalledWith([
            { account_id: 2, amount_change: 100 }
        ]);
    });
});
