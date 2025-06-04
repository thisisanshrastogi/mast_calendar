// Account types
export interface Account {
  account_id: string
  balance_available: number
  balance_current: number
  financial_name: string
  id:number
  mask: string
  name: string
  type:string
  subtype:string
  userId:string
  
}


export interface LoaderMessageProps {
  customMessage?: string;
}

export interface AccountDashboardProps {
  account: Account;
  recurringFlow: RecurringFlowState | null;
}

export interface RecurringFlowState{
  average_inflow: number,
  average_outflow: number,
  last_inflow: number,
  last_outflow: number,
}

export interface Transaction {
  id: number
  transaction_id: string
  account_id: string
  name: string
  date: string
  datetime: string
  description: string
  amount: number
  category: string
  merchant_name: string | null
  payment_channel: string
  personal_finance_category: string
  personal_finance_category_icon_url: string
  counter_parties_involved: string
  isPending: boolean
  createdAt: string
  updatedAt: string
}

export interface TransactionViewProps {
  selectedPeriod:string
  selectedAccount: Account
}

export interface RecurringViewProps {
  selectedAccount:Account
  viewMode: "calendar" | "detailed"
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

export interface RecurringTransactionState {
  id: number;
  account_id: string;
  description: string;
  frequency: string;
  type: string;
  status: string;
  is_active: boolean;
  first_date: string;
  last_date: string;
  average_amount: string;
  last_amount: string;
  personal_finance_category: string;
  predicte_date: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface CalendarProps{
  recurringTransactions: RecurringTransaction[];

}


