import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title?: string;
  items: FAQItem[];
  variant?: 'default' | 'card' | 'minimal';
  allowMultiple?: boolean;
  className?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  title,
  items,
  variant = 'default',
  allowMultiple = false,
  className
}) => {
  const accordionContent = (
    <Accordion 
      type={allowMultiple ? "multiple" : "single"} 
      collapsible 
      className="w-full"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  if (variant === 'minimal') {
    return (
      <div className={cn('space-y-2', className)}>
        {title && (
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
        )}
        {accordionContent}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {accordionContent}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
      )}
      {accordionContent}
    </div>
  );
};

export default FAQAccordion;
export { FAQAccordion };