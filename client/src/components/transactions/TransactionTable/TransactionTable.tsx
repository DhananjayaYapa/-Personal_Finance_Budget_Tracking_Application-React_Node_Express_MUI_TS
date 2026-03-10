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
  IconButton,
  Chip,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { Transaction } from '../../../utilities/models'
import { formatCurrency, formatDate } from '../../../utilities/helpers'
import { TRANSACTION_TYPE } from '../../../utilities/constants'

interface TransactionTableProps {
  transactions: Transaction[]
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}) => (
  <Card>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction: Transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.title || '-'}</TableCell>
                <TableCell>{transaction.category?.name || 'Uncategorized'}</TableCell>
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
                    fontWeight: 600,
                    color:
                      transaction.type === TRANSACTION_TYPE.INCOME ? 'success.main' : 'error.main',
                  }}
                >
                  {transaction.type === TRANSACTION_TYPE.INCOME ? '+' : '-'}
                  {formatCurrency(Number(transaction.amount))}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onEdit(transaction)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(transaction.id)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
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

export default TransactionTable
