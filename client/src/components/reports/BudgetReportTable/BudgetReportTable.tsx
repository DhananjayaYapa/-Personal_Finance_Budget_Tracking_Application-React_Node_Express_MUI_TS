import React from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material'
import { formatCurrency } from '../../../utilities/helpers'

export interface BudgetReportItem {
  id: string
  monthYear: string
  categoryName: string
  amount: number
  spentAmount: number
  remaining: number
  percentageUsed: number
  status: string
}

interface BudgetReportTableProps {
  budgets: BudgetReportItem[]
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
}

const BudgetReportTable: React.FC<BudgetReportTableProps> = ({
  budgets,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => (
  <Card sx={{ mb: 4 }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Month/Year</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Spent</TableCell>
            <TableCell align="right">Remaining</TableCell>
            <TableCell align="center">Usage</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {budgets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                No budgets found for the selected filters
              </TableCell>
            </TableRow>
          ) : (
            budgets.map((budget) => (
              <TableRow key={budget.id} hover>
                <TableCell>{budget.monthYear}</TableCell>
                <TableCell>{budget.categoryName}</TableCell>
                <TableCell align="right">{formatCurrency(budget.amount)}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: budget.spentAmount > budget.amount ? 'error.main' : 'text.primary' }}
                >
                  {formatCurrency(budget.spentAmount)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: budget.remaining < 0 ? 'error.main' : 'success.main' }}
                >
                  {formatCurrency(budget.remaining)}
                </TableCell>
                <TableCell align="center">{budget.percentageUsed}%</TableCell>
                <TableCell align="center">
                  <Chip
                    label={budget.status}
                    size="small"
                    color={
                      budget.status === 'Over Budget'
                        ? 'error'
                        : budget.status === 'Near Limit'
                          ? 'warning'
                          : 'success'
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  </Card>
)

export default BudgetReportTable
