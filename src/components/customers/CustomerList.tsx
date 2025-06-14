
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Mail, Phone, Building } from 'lucide-react';
import { Customer } from '@/types/customer';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  loading?: boolean;
}

export const CustomerList = ({ customers, onEdit, onDelete, loading }: CustomerListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (customerId: string) => {
    setDeletingId(customerId);
    try {
      await onDelete(customerId);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-slate-600">No customers added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  {customer.company && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>{customer.company}</span>
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-slate-600">
                  {customer.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <p className="text-xs mt-2">{customer.address}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(customer)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => customer.id && handleDelete(customer.id)}
                  disabled={deletingId === customer.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
