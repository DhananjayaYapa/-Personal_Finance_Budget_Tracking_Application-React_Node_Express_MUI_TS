// @ts-expect-error - json2csv has no type declarations
import { Parser } from 'json2csv';

// ─── Transaction Export Interface ───────────────────────────────────────────

interface TransactionExportRow {
    id: number;
    title: string;
    amount: string | number;
    type: string;
    category: string;
    date: string | Date;
    note: string | null;
    createdAt: string | Date;
}

// ─── Export to CSV ──────────────────────────────────────────────────────────

export const exportToCSV = (transactions: TransactionExportRow[]): string => {
    if (!transactions || transactions.length === 0) {
        return 'No data to export';
    }

    const fields = [
        { label: 'Transaction ID', value: 'id' },
        { label: 'Title', value: 'title' },
        { label: 'Amount', value: 'amount' },
        { label: 'Type', value: 'type' },
        { label: 'Category', value: 'category' },
        { label: 'Date', value: 'date' },
        { label: 'Note', value: 'note' },
        { label: 'Created At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(transactions);
};

// ─── Export to JSON ─────────────────────────────────────────────────────────

export const exportToJSON = (transactions: TransactionExportRow[]) => {
    return {
        exportDate: new Date().toISOString(),
        totalCount: transactions.length,
        transactions: transactions.map((t) => ({
            id: t.id,
            title: t.title,
            amount: t.amount,
            type: t.type,
            category: t.category,
            date: t.date,
            note: t.note,
            createdAt: t.createdAt,
        })),
    };
};

// ─── Budget Export Interface ────────────────────────────────────────────────

interface BudgetExportRow {
    id: number;
    category: string;
    amount: string | number;
    month: number;
    year: string;
    spentAmount: number;
    remaining: number;
    percentageUsed: number;
    status: string;
    createdAt: string | Date;
}

// ─── Export Budgets to CSV ──────────────────────────────────────────────────

export const exportBudgetsToCSV = (budgets: BudgetExportRow[]): string => {
    if (!budgets || budgets.length === 0) {
        return 'No data to export';
    }

    const fields = [
        { label: 'Budget ID', value: 'id' },
        { label: 'Category', value: 'category' },
        { label: 'Budget Amount', value: 'amount' },
        { label: 'Month', value: 'month' },
        { label: 'Year', value: 'year' },
        { label: 'Spent Amount', value: 'spentAmount' },
        { label: 'Remaining', value: 'remaining' },
        { label: 'Usage %', value: 'percentageUsed' },
        { label: 'Status', value: 'status' },
        { label: 'Created At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(budgets);
};

// ─── Export Budgets to JSON ─────────────────────────────────────────────────

export const exportBudgetsToJSON = (budgets: BudgetExportRow[]) => {
    return {
        exportDate: new Date().toISOString(),
        totalCount: budgets.length,
        budgets: budgets.map((b) => ({
            id: b.id,
            category: b.category,
            amount: b.amount,
            month: b.month,
            year: b.year,
            spentAmount: b.spentAmount,
            remaining: b.remaining,
            percentageUsed: b.percentageUsed,
            status: b.status,
            createdAt: b.createdAt,
        })),
    };
};

// ─── Helper ─────────────────────────────────────────────────────────────────

export const getExportFilename = (format: string, type: 'transactions' | 'budgets' = 'transactions'): string => {
    const date = new Date().toISOString().split('T')[0];
    return `${type}-export-${date}.${format}`;
};
