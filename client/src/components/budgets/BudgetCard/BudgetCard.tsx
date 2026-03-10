import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, IconButton, LinearProgress } from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import type { Budget, BudgetProgress } from '../../../utilities/models'
import { formatCurrency } from '../../../utilities/helpers'
import { MONTHS } from '../../../utilities/constants'
import styles from './BudgetCard.module.scss'

interface BudgetCardProps {
  budget: Budget
  progress?: BudgetProgress
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
  isCompact?: boolean
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  progress,
  onEdit,
  onDelete,
  isCompact = false,
}) => {
  const spent = progress ? Number(progress.spentAmount) : 0
  const limit = Number(budget.amount)
  const percentage = progress
    ? Number(progress.percentageUsed)
    : limit > 0
      ? Math.min((spent / limit) * 100, 100)
      : 0
  const isOverBudget = progress ? progress.exceeded : spent > limit
  const remaining = progress ? Number(progress.remaining) : Math.max(limit - spent, 0)

  const monthLabel = MONTHS.find((m) => m.value === budget.month)?.label || 'Unknown'

  return (
    <Card className={`${styles.budgetCard} ${isCompact ? styles.compactCard : ''}`}>
      <CardContent sx={{ p: isCompact ? 1.5 : 2, '&:last-child': { pb: isCompact ? 1.5 : 2 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: isCompact ? 1 : 2,
          }}
        >
          <Box>
            <Typography variant={isCompact ? 'subtitle2' : 'h6'} fontWeight={500}>
              {budget.category?.name || 'Budget'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {monthLabel} {budget.year}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => onEdit(budget)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(budget.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: isCompact ? 1 : 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Spent
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              color={isOverBudget ? 'error.main' : 'text.primary'}
            >
              {formatCurrency(spent)} / {formatCurrency(limit)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              height: isCompact ? 6 : 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: isOverBudget ? 'error.main' : 'primary.main',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Remaining
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            color={isOverBudget ? 'error.main' : 'success.main'}
          >
            {isOverBudget ? `Over by ${formatCurrency(spent - limit)}` : formatCurrency(remaining)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

// Expandable card wrapper for categories with multiple month budgets
export interface ProcessedBudgetGroup {
  primaryBudget: Budget
  otherBudgets: Budget[]
  hasMultiple: boolean
}

interface ExpandableBudgetCardProps {
  processedGroup: ProcessedBudgetGroup
  getProgress: (budgetId: string) => BudgetProgress | undefined
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export const ExpandableBudgetCard: React.FC<ExpandableBudgetCardProps> = ({
  processedGroup,
  getProgress,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { primaryBudget, otherBudgets, hasMultiple } = processedGroup

  if (!hasMultiple) {
    return (
      <BudgetCard
        budget={primaryBudget}
        progress={getProgress(primaryBudget.id)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }

  return (
    <Box
      className={`${styles.expandableContainer} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Primary Budget Card */}
      <Box
        sx={{
          flex: 1,
          borderRadius: '8px',
          border: isExpanded ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
          borderBottom: isExpanded ? 'none' : undefined,
          borderBottomLeftRadius: isExpanded ? 0 : '8px',
          borderBottomRightRadius: isExpanded ? 0 : '8px',
          transition: 'border 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <BudgetCard
          budget={primaryBudget}
          progress={getProgress(primaryBudget.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Box>

      {/* Expand indicator */}
      {hasMultiple && !isExpanded && (
        <Box className={styles.expandIndicator}>
          <ExpandMoreIcon fontSize="small" />
          <Typography variant="caption">
            +{otherBudgets.length} more month{otherBudgets.length > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}

      {/* Expanded content with other budgets */}
      <Box className={styles.expandedContent}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 1, mt: 1 }}
        >
          Other months:
        </Typography>
        {otherBudgets.map((budget) => (
          <Box key={budget.id} sx={{ mb: 1 }}>
            <BudgetCard
              budget={budget}
              progress={getProgress(budget.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              isCompact
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default BudgetCard
