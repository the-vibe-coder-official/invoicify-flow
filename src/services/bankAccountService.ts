
import { supabase } from '@/integrations/supabase/client';
import { BankAccount } from '@/types/bankAccount';

export const saveBankAccount = async (bankAccount: BankAccount, userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .insert({
        user_id: userId,
        account_name: bankAccount.accountName,
        account_type: bankAccount.accountType,
        routing_number: bankAccount.routingNumber,
        account_number: bankAccount.accountNumber,
        iban: bankAccount.iban,
        bic_swift: bankAccount.bicSwift,
        sort_code: bankAccount.sortCode,
        uk_account_number: bankAccount.ukAccountNumber,
        bank_name: bankAccount.bankName,
        is_default: bankAccount.isDefault || false
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error saving bank account:', error);
    throw new Error('Could not save bank account');
  }
};

export const getBankAccounts = async (userId: string): Promise<BankAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(account => ({
      id: account.id,
      userId: account.user_id,
      accountName: account.account_name,
      accountType: account.account_type as BankAccount['accountType'],
      routingNumber: account.routing_number,
      accountNumber: account.account_number,
      iban: account.iban,
      bicSwift: account.bic_swift,
      sortCode: account.sort_code,
      ukAccountNumber: account.uk_account_number,
      bankName: account.bank_name,
      isDefault: account.is_default,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    }));
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    throw new Error('Could not fetch bank accounts');
  }
};
