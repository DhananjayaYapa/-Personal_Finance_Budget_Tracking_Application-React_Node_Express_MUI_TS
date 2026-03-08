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

// ─── Helper ─────────────────────────────────────────────────────────────────

export const getExportFilename = (format: string): string => {
    const date = new Date().toISOString().split('T')[0];
    return `transactions-export-${date}.${format}`;
};
