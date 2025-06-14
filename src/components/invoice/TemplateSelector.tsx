
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceTemplate } from '@/types/invoice';

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onTemplateChange: (template: InvoiceTemplate) => void;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  const templates = [
    { value: 'modern' as InvoiceTemplate, label: 'Modern', description: 'Clean and contemporary design' },
    { value: 'classic' as InvoiceTemplate, label: 'Classic', description: 'Traditional business format' },
    { value: 'minimal' as InvoiceTemplate, label: 'Minimal', description: 'Simple and clean layout' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Choose Template</Label>
            <Select value={selectedTemplate} onValueChange={onTemplateChange}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    <div>
                      <div className="font-medium">{template.label}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            Selected: <span className="font-medium">{templates.find(t => t.value === selectedTemplate)?.label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
