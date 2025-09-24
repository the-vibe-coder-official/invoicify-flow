import { z } from 'zod';

// Invoice validation schemas
export const invoiceItemSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  quantity: z.number()
    .min(0.01, "Quantity must be greater than 0")
    .max(9999999, "Quantity is too large"),
  price: z.number()
    .min(0, "Price cannot be negative")
    .max(999999999, "Price is too large"),
  total: z.number()
    .min(0, "Total cannot be negative")
    .max(999999999, "Total is too large")
});

export const invoiceSchema = z.object({
  id: z.string().uuid().optional(),
  invoiceNumber: z.string()
    .trim()
    .min(1, "Invoice number is required")
    .max(50, "Invoice number must be less than 50 characters")
    .regex(/^[A-Za-z0-9\-_]+$/, "Invoice number can only contain letters, numbers, hyphens, and underscores"),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  dueDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
  customerName: z.string()
    .trim()
    .min(1, "Customer name is required")
    .max(200, "Customer name must be less than 200 characters"),
  customerEmail: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  customerAddress: z.string()
    .trim()
    .max(1000, "Address must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  customerLogoUrl: z.string()
    .url("Invalid logo URL")
    .max(500, "Logo URL must be less than 500 characters")
    .optional(),
  items: z.array(invoiceItemSchema)
    .min(1, "At least one item is required")
    .max(100, "Maximum 100 items allowed"),
  subtotal: z.number()
    .min(0, "Subtotal cannot be negative")
    .max(999999999, "Subtotal is too large"),
  taxRate: z.number()
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100%"),
  taxAmount: z.number()
    .min(0, "Tax amount cannot be negative")
    .max(999999999, "Tax amount is too large"),
  total: z.number()
    .min(0, "Total cannot be negative")
    .max(999999999, "Total is too large"),
  notes: z.string()
    .trim()
    .max(2000, "Notes must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  template: z.enum(['modern', 'classic', 'minimal']).optional(),
  bankAccountId: z.string().uuid().optional()
});

// Customer validation schema
export const customerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .trim()
    .max(50, "Phone must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  address: z.string()
    .trim()
    .max(1000, "Address must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  company: z.string()
    .trim()
    .max(200, "Company must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  taxNumber: z.string()
    .trim()
    .max(50, "Tax number must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  notes: z.string()
    .trim()
    .max(2000, "Notes must be less than 2000 characters")
    .optional()
    .or(z.literal(""))
});

// Bank account validation schema
export const bankAccountSchema = z.object({
  id: z.string().uuid().optional(),
  accountName: z.string()
    .trim()
    .min(1, "Account name is required")
    .max(200, "Account name must be less than 200 characters"),
  accountType: z.enum(['checking', 'savings', 'business']),
  bankName: z.string()
    .trim()
    .max(200, "Bank name must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  // US bank account fields
  routingNumber: z.string()
    .trim()
    .regex(/^\d{9}$/, "Routing number must be 9 digits")
    .optional()
    .or(z.literal("")),
  accountNumber: z.string()
    .trim()
    .regex(/^\d{4,17}$/, "Account number must be 4-17 digits")
    .optional()
    .or(z.literal("")),
  // European bank account fields
  iban: z.string()
    .trim()
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, "Invalid IBAN format")
    .optional()
    .or(z.literal("")),
  bicSwift: z.string()
    .trim()
    .regex(/^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/, "Invalid BIC/SWIFT format")
    .optional()
    .or(z.literal("")),
  // UK bank account fields
  sortCode: z.string()
    .trim()
    .regex(/^\d{2}-?\d{2}-?\d{2}$/, "Sort code must be in format XX-XX-XX")
    .optional()
    .or(z.literal("")),
  ukAccountNumber: z.string()
    .trim()
    .regex(/^\d{8}$/, "UK account number must be 8 digits")
    .optional()
    .or(z.literal("")),
  isDefault: z.boolean().optional()
}).refine((data) => {
  // Ensure at least one account identifier is provided
  const hasUSAccount = data.routingNumber && data.accountNumber;
  const hasEuropeanAccount = data.iban;
  const hasUKAccount = data.sortCode && data.ukAccountNumber;
  
  return hasUSAccount || hasEuropeanAccount || hasUKAccount;
}, {
  message: "Please provide valid account details (US: routing + account number, Europe: IBAN, UK: sort code + account number)",
  path: ["accountNumber"]
});

// Security validation utilities
export const validateInvoiceData = (data: unknown) => {
  return invoiceSchema.parse(data);
};

export const validateCustomerData = (data: unknown) => {
  return customerSchema.parse(data);
};

export const validateBankAccountData = (data: unknown) => {
  return bankAccountSchema.parse(data);
};

// Sanitization utilities
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const sanitizeInvoiceData = (invoice: any) => {
  return {
    ...invoice,
    invoiceNumber: sanitizeString(invoice.invoiceNumber || ''),
    customerName: sanitizeString(invoice.customerName || ''),
    customerEmail: sanitizeString(invoice.customerEmail || ''),
    customerAddress: sanitizeString(invoice.customerAddress || ''),
    notes: sanitizeString(invoice.notes || ''),
    items: invoice.items?.map((item: any) => ({
      ...item,
      description: sanitizeString(item.description || '')
    })) || []
  };
};