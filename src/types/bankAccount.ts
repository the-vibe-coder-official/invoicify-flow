
export type BankAccountType = 'us' | 'eu' | 'uk';

export interface BankAccount {
  id?: string;
  userId?: string;
  accountName: string;
  accountType: BankAccountType;
  
  // US fields
  routingNumber?: string;
  accountNumber?: string;
  
  // EU fields
  iban?: string;
  bicSwift?: string;
  
  // UK fields
  sortCode?: string;
  ukAccountNumber?: string;
  
  // Common fields
  bankName?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
