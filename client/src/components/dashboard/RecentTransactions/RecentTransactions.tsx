import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { ArrowUpward as ArrowUpIcon, ArrowDownward as ArrowDownIcon } from '@mui/icons-material'
import { formatCurrency } from '../../../utilities/helpers'
import { TRANSACTION_TYPE } from '../../../utilities/constants'

export interface RecentTransactionItem {
  id: string
  title: string
  categoryName: string
  date: string
  type: string
  amount: number
}

interface RecentTransactionsProps {
  transactions: RecentTransactionItem[]
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      {transactions.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No transactions yet. Start tracking your finances!
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: { xs: 450, sm: 'auto' } }}>
            {transactions.map((transaction) => (
              <Box
                key={transaction.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                {/* Column 1: Transaction Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {transaction.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {transaction.categoryName}
                  </Typography>
                </Box>
                {/* Column 2: Date */}
                <Box sx={{ width: 130, textAlign: 'center', px: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {transaction.date}
                  </Typography>
                </Box>
                {/* Column 3: Arrow */}
                <Box
                  sx={{
                    width: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {transaction.type === TRANSACTION_TYPE.INCOME ? (
                    <ArrowUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                  ) : (
                    <ArrowDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                  )}
                </Box>
                {/* Column 4: Amount */}
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    color:
                      transaction.type === TRANSACTION_TYPE.INCOME ? 'success.main' : 'error.main',
                    width: 100,
                    textAlign: 'right',
                  }}
                >
                  {transaction.type === TRANSACTION_TYPE.INCOME ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </CardContent>
  </Card>
)

export default RecentTransactions
