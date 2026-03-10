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
import { TRANSACTION_TYPE } from '../../../utilities/constants'

export interface TransactionReportItem {
  id: string
  date: string
  title: string
  categoryName: string
  type: string
  amount: number
}

interface TransactionReportTableProps {
  transactions: TransactionReportItem[]
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
}

const TransactionReportTable: React.FC<TransactionReportTableProps> = ({
  transactions,
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
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No transactions found for the selected filters
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.title || '-'}</TableCell>
                <TableCell>{transaction.categoryName}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type === TRANSACTION_TYPE.INCOME ? 'Income' : 'Expense'}
                    size="small"
                    color={transaction.type === TRANSACTION_TYPE.INCOME ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      transaction.type === TRANSACTION_TYPE.INCOME ? 'success.main' : 'error.main',
                    fontWeight: 500,
                  }}
                >
                  {transaction.type === TRANSACTION_TYPE.INCOME ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
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

export default TransactionReportTable
