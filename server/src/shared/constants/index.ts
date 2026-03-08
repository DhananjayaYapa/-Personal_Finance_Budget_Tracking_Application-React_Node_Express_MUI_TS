// ─── Auth Constants ─────────────────────────────────────────────────────────

export const SALT_ROUNDS = 10;

export const JWT_DEFAULTS = {
    EXPIRES_IN: '7d',
} as const;

// ─── Pagination Defaults ────────────────────────────────────────────────────

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;

// ─── Sort Defaults ──────────────────────────────────────────────────────────

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
