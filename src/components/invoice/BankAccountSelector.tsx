import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, CreditCard } from 'lucide-react';
import { BankAccount } from '@/types/bankAccount';
import { getBankAccounts, saveBankAccount } from '@/services/bankAccountService';
import { BankAccountForm } from './BankAccountForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BankAccountSelectorProps {
  selectedBankAccountId?: string;
  onBankAccountSelect: (bankAccountId: string | undefined) => void;
}

export const BankAccountSelector = ({ selectedBankAccountId, onBankAccountSelect }: BankAccountSelectorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    accountName: '',
    accountType: 'us',
    isDefault: false
  });

  useEffect(() => {
    loadBankAccounts();
  }, [user]);

  const loadBankAccounts = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const accounts = await getBankAccounts(user.id);
      setBankAccounts(accounts);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      toast({
        title: "Error",
        description: "Could not load bank accounts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBankAccount = async () => {
    if (!user) return;

    if (!newBankAccount.accountName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an account name.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const bankAccountId = await saveBankAccount(newBankAccount, user.id);
      
      await loadBankAccounts();
      setShowAddForm(false);
      setNewBankAccount({
        accountName: '',
        accountType: 'us',
        isDefault: false
      });

      toast({
        title: "Success",
        description: "Bank account saved successfully."
      });

      // Auto-select the newly created bank account
      onBankAccountSelect(bankAccountId);
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast({
        title: "Error",
        description: "Could not save bank account.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <BankAccountForm
          bankAccount={newBankAccount}
          onBankAccountChange={setNewBankAccount}
        />
        <div className="flex space-x-2">
          <Button 
            onClick={handleSaveBankAccount}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Bank Account'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAddForm(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Bank Account
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bank Account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading bank accounts...</div>
        ) : bankAccounts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No bank accounts found. Add one to include banking details on your invoices.
          </div>
        ) : (
          <div>
            <Label htmlFor="bankAccountSelect">Select Bank Account</Label>
            <Select
              value={selectedBankAccountId || ''}
              onValueChange={(value) => onBankAccountSelect(value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No bank account</SelectItem>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id!}>
                    {account.accountName} ({account.accountType.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
