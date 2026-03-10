// Transaction Types
export const TRANSACTION_TYPE = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]

// Transaction Type Options for dropdowns
export const TRANSACTION_TYPE_OPTIONS = [
  { value: TRANSACTION_TYPE.INCOME, label: 'Income' },
  { value: TRANSACTION_TYPE.EXPENSE, label: 'Expense' },
]

// Category Types (same as transaction types)
export const CATEGORY_TYPE = TRANSACTION_TYPE
export type CategoryType = TransactionType

export const CATEGORY_TYPE_OPTIONS = TRANSACTION_TYPE_OPTIONS

// Months for budget selection
export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

// Years for budget selection (current year and next 2 years)
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear()
  return [
    { value: currentYear - 1, label: String(currentYear - 1) },
    { value: currentYear, label: String(currentYear) },
    { value: currentYear + 1, label: String(currentYear + 1) },
    { value: currentYear + 2, label: String(currentYear + 2) },
  ]
}

// Chart colors
export const CHART_COLORS = {
  income: '#22c55e',
  expense: '#ef4444',
  budget: '#3b82f6',
  primary: '#22c55e',
  secondary: '#8b5cf6',
  palette: [
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#84cc16',
    '#f97316',
    '#6366f1',
  ],
}

// Export formats
export const EXPORT_FORMAT = {
  CSV: 'csv',
  JSON: 'json',
} as const

export type ExportFormat = (typeof EXPORT_FORMAT)[keyof typeof EXPORT_FORMAT]
