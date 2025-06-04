// Account types
export interface Account {
  id: number
  name: string
  balance: number
  type: string
  accountNumber: string
  transactions: Transaction[]
  recurringTransactions: RecurringTransaction[]
}

export interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  category: string
  isPending: boolean
}

export interface RecurringTransaction {
  id: number
  name: string
  amount: number
  dueDate: string
  frequency: string
  category: string
  isPaid: boolean
  nextDueDate: string
}

// Mock data
export const mockAccounts: Account[] = [
  {
    id: 1,
    name: "Checking Account",
    balance: 5420.5,
    type: "checking",
    accountNumber: "****1234",
    transactions: [
      { id: 1, date: "2024-01-15", description: "Grocery Store", amount: -85.5, category: "Food", isPending: false },
      {
        id: 2,
        date: "2024-01-14",
        description: "Salary Deposit",
        amount: 3500.0,
        category: "Income",
        isPending: false,
      },
      {
        id: 5,
        date: "2024-01-11",
        description: "Gas Station",
        amount: -45.2,
        category: "Transportation",
        isPending: false,
      },
      { id: 6, date: "2024-01-10", description: "Restaurant", amount: -67.8, category: "Food", isPending: false },
      { id: 8, date: "2024-01-08", description: "Coffee Shop", amount: -12.5, category: "Food", isPending: false },
      { id: 10, date: "2024-01-06", description: "ATM Withdrawal", amount: -100.0, category: "Cash", isPending: false },
      {
        id: 11,
        date: "2023-12-28",
        description: "Freelance Payment",
        amount: 800.0,
        category: "Income",
        isPending: false,
      },
      {
        id: 13,
        date: "2023-11-30",
        description: "Rent Payment",
        amount: -1200.0,
        category: "Housing",
        isPending: false,
      },
      {
        id: 15,
        date: "2023-10-15",
        description: "Utility Bill",
        amount: -89.5,
        category: "Utilities",
        isPending: false,
      },
      { id: 16, date: "2024-01-17", description: "Grocery Store", amount: -65.75, category: "Food", isPending: true },
    ],
    recurringTransactions: [
      {
        id: 1,
        name: "Rent",
        amount: 1200.0,
        dueDate: "2024-01-01",
        nextDueDate: "2024-02-01",
        frequency: "monthly",
        category: "Housing",
        isPaid: false,
      },
      {
        id: 4,
        name: "Phone Bill",
        amount: 45.0,
        dueDate: "2024-01-15",
        nextDueDate: "2024-02-15",
        frequency: "monthly",
        category: "Utilities",
        isPaid: false,
      },
      {
        id: 6,
        name: "Gym Membership",
        amount: 29.99,
        dueDate: "2024-01-25",
        nextDueDate: "2024-02-25",
        frequency: "monthly",
        category: "Health",
        isPaid: false,
      },
      {
        id: 9,
        name: "Water Bill",
        amount: 42.0,
        dueDate: "2024-01-08",
        nextDueDate: "2024-02-08",
        frequency: "monthly",
        category: "Utilities",
        isPaid: true,
      },
    ],
  },
  {
    id: 2,
    name: "Savings Account",
    balance: 12350.75,
    type: "savings",
    accountNumber: "****5678",
    transactions: [
      {
        id: 3,
        date: "2024-01-13",
        description: "Interest Payment",
        amount: 25.75,
        category: "Income",
        isPending: false,
      },
      {
        id: 7,
        date: "2024-01-09",
        description: "Transfer from Checking",
        amount: 500.0,
        category: "Transfer",
        isPending: false,
      },
      {
        id: 14,
        date: "2023-11-15",
        description: "Investment Dividend",
        amount: 150.0,
        category: "Income",
        isPending: false,
      },
      {
        id: 17,
        date: "2024-01-16",
        description: "Transfer to Investment",
        amount: -1000.0,
        category: "Transfer",
        isPending: false,
      },
    ],
    recurringTransactions: [
      {
        id: 12,
        name: "Automatic Savings",
        amount: 200.0,
        dueDate: "2024-01-14",
        nextDueDate: "2024-02-14",
        frequency: "monthly",
        category: "Savings",
        isPaid: true,
      },
    ],
  },
  {
    id: 3,
    name: "Credit Card",
    balance: -1250.3,
    type: "credit",
    accountNumber: "****9012",
    transactions: [
      {
        id: 4,
        date: "2024-01-12",
        description: "Online Shopping",
        amount: -125.99,
        category: "Shopping",
        isPending: false,
      },
      {
        id: 9,
        date: "2024-01-07",
        description: "Subscription Service",
        amount: -29.99,
        category: "Utilities",
        isPending: false,
      },
      {
        id: 12,
        date: "2023-12-25",
        description: "Holiday Shopping",
        amount: -245.0,
        category: "Shopping",
        isPending: false,
      },
      { id: 18, date: "2024-01-18", description: "Restaurant", amount: -85.5, category: "Food", isPending: true },
    ],
    recurringTransactions: [
      {
        id: 2,
        name: "Electric Bill",
        amount: 85.5,
        dueDate: "2024-01-05",
        nextDueDate: "2024-02-05",
        frequency: "monthly",
        category: "Utilities",
        isPaid: true,
      },
      {
        id: 3,
        name: "Internet",
        amount: 59.99,
        dueDate: "2024-01-10",
        nextDueDate: "2024-02-10",
        frequency: "monthly",
        category: "Utilities",
        isPaid: false,
      },
      {
        id: 5,
        name: "Car Insurance",
        amount: 125.0,
        dueDate: "2024-01-20",
        nextDueDate: "2024-02-20",
        frequency: "monthly",
        category: "Insurance",
        isPaid: true,
      },
      {
        id: 7,
        name: "Netflix",
        amount: 15.99,
        dueDate: "2024-01-12",
        nextDueDate: "2024-02-12",
        frequency: "monthly",
        category: "Entertainment",
        isPaid: true,
      },
      {
        id: 8,
        name: "Spotify",
        amount: 9.99,
        dueDate: "2024-01-18",
        nextDueDate: "2024-02-18",
        frequency: "monthly",
        category: "Entertainment",
        isPaid: false,
      },
      {
        id: 13,
        name: "Credit Card Payment",
        amount: 250.0,
        dueDate: "2024-01-30",
        nextDueDate: "2024-02-28",
        frequency: "monthly",
        category: "Credit",
        isPaid: false,
      },
    ],
  },
  {
    id: 4,
    name: "Investment Account",
    balance: 8750.25,
    type: "investment",
    accountNumber: "****3456",
    transactions: [
      {
        id: 19,
        date: "2024-01-10",
        description: "Stock Purchase",
        amount: -500.0,
        category: "Investment",
        isPending: false,
      },
      {
        id: 20,
        date: "2024-01-05",
        description: "Dividend Payment",
        amount: 75.25,
        category: "Income",
        isPending: false,
      },
      {
        id: 21,
        date: "2023-12-20",
        description: "Stock Sale",
        amount: 320.0,
        category: "Investment",
        isPending: false,
      },
    ],
    recurringTransactions: [
      {
        id: 14,
        name: "Investment Contribution",
        amount: 300.0,
        dueDate: "2024-01-16",
        nextDueDate: "2024-02-16",
        frequency: "monthly",
        category: "Investment",
        isPaid: false,
      },
    ],
  },
  {
    id: 5,
    name: "Business Account",
    balance: 3200.0,
    type: "business",
    accountNumber: "****7890",
    transactions: [
      {
        id: 22,
        date: "2024-01-15",
        description: "Client Payment",
        amount: 1500.0,
        category: "Income",
        isPending: false,
      },
      {
        id: 23,
        date: "2024-01-12",
        description: "Office Supplies",
        amount: -120.5,
        category: "Business",
        isPending: false,
      },
      {
        id: 24,
        date: "2024-01-08",
        description: "Software Subscription",
        amount: -49.99,
        category: "Business",
        isPending: false,
      },
      {
        id: 25,
        date: "2024-01-05",
        description: "Client Meeting",
        amount: -65.0,
        category: "Business",
        isPending: false,
      },
    ],
    recurringTransactions: [
      {
        id: 10,
        name: "Office Rent",
        amount: 800.0,
        dueDate: "2024-01-22",
        nextDueDate: "2024-02-22",
        frequency: "monthly",
        category: "Business",
        isPaid: false,
      },
      {
        id: 11,
        name: "Health Insurance",
        amount: 285.0,
        dueDate: "2024-01-28",
        nextDueDate: "2024-02-28",
        frequency: "monthly",
        category: "Insurance",
        isPaid: false,
      },
      {
        id: 15,
        name: "Cloud Storage",
        amount: 9.99,
        dueDate: "2024-01-11",
        nextDueDate: "2024-02-11",
        frequency: "monthly",
        category: "Technology",
        isPaid: true,
      },
    ],
  },
]
