
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BankAccount, BankAccountType } from '@/types/bankAccount';

interface BankAccountFormProps {
  bankAccount: BankAccount;
  onBankAccountChange: (bankAccount: BankAccount) => void;
}

export const BankAccountForm = ({ bankAccount, onBankAccountChange }: BankAccountFormProps) => {
  const updateBankAccount = (updates: Partial<BankAccount>) => {
    onBankAccountChange({ ...bankAccount, ...updates });
  };

  const renderUSFields = () => (
    <>
      <div>
        <Label htmlFor="routingNumber">Routing Number</Label>
        <Input
          id="routingNumber"
          value={bankAccount.routingNumber || ''}
          onChange={(e) => updateBankAccount({ routingNumber: e.target.value })}
          placeholder="123456789"
        />
      </div>
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          value={bankAccount.accountNumber || ''}
          onChange={(e) => updateBankAccount({ accountNumber: e.target.value })}
          placeholder="1234567890"
        />
      </div>
    </>
  );

  const renderEUFields = () => (
    <>
      <div>
        <Label htmlFor="iban">IBAN</Label>
        <Input
          id="iban"
          value={bankAccount.iban || ''}
          onChange={(e) => updateBankAccount({ iban: e.target.value })}
          placeholder="DE89 3704 0044 0532 0130 00"
        />
      </div>
      <div>
        <Label htmlFor="bicSwift">BIC/SWIFT Code</Label>
        <Input
          id="bicSwift"
          value={bankAccount.bicSwift || ''}
          onChange={(e) => updateBankAccount({ bicSwift: e.target.value })}
          placeholder="COBADEFFXXX"
        />
      </div>
    </>
  );

  const renderUKFields = () => (
    <>
      <div>
        <Label htmlFor="sortCode">Sort Code</Label>
        <Input
          id="sortCode"
          value={bankAccount.sortCode || ''}
          onChange={(e) => updateBankAccount({ sortCode: e.target.value })}
          placeholder="12-34-56"
        />
      </div>
      <div>
        <Label htmlFor="ukAccountNumber">Account Number</Label>
        <Input
          id="ukAccountNumber"
          value={bankAccount.ukAccountNumber || ''}
          onChange={(e) => updateBankAccount({ ukAccountNumber: e.target.value })}
          placeholder="12345678"
        />
      </div>
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            value={bankAccount.accountName}
            onChange={(e) => updateBankAccount({ accountName: e.target.value })}
            placeholder="Business Account"
          />
        </div>

        <div>
          <Label htmlFor="accountType">Account Region</Label>
          <Select
            value={bankAccount.accountType}
            onValueChange={(value: BankAccountType) => updateBankAccount({ accountType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="eu">European Union</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bankName">Bank Name (Optional)</Label>
          <Input
            id="bankName"
            value={bankAccount.bankName || ''}
            onChange={(e) => updateBankAccount({ bankName: e.target.value })}
            placeholder="Bank of America"
          />
        </div>

        {bankAccount.accountType === 'us' && renderUSFields()}
        {bankAccount.accountType === 'eu' && renderEUFields()}
        {bankAccount.accountType === 'uk' && renderUKFields()}
      </CardContent>
    </Card>
  );
};
