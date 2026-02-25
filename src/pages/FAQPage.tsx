import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/molecules/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';
import i18n from '@/lib/i18n';
import faqEn from '@/data/snapshots/en/pages/faq.json';
import faqZh from '@/data/snapshots/zh/pages/faq.json';

type FaqItem = { question: string; answer: string; tags: string[] };
type FaqSnapshot = {
  categories: {
    selection: FaqItem[];
    specs: FaqItem[];
    procurement: FaqItem[];
    maintenance: FaqItem[];
  };
};

const FAQPage = () => {
  const { t } = useTranslation();
  const content: FaqSnapshot = (i18n.language === 'zh' ? (faqZh as unknown) : (faqEn as unknown)) as FaqSnapshot;
  const faqCategories = [
    {
      category: t('faq.categories.selection.name'),
      icon: HelpCircle,
      questions: content.categories.selection
    },
    {
      category: t('faq.categories.specs.name'),
      icon: CheckCircle,
      questions: content.categories.specs
    },
    {
      category: t('faq.categories.procurement.name'),
      icon: AlertCircle,
      questions: content.categories.procurement
    },
    {
      category: t('faq.categories.maintenance.name'),
      icon: Info,
      questions: content.categories.maintenance
    }
  ];

  const totalQuestions = faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <>
      <SEOHead
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqCategories.flatMap(category => 
            category.questions.map(q => ({
              "@type": "Question",
              "name": q.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer
              }
            }))
          )
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
          <div className="flex justify-center gap-4 mt-6">
          <Badge variant="outline" className="text-sm">
            {t('faq.stats.categories', { count: faqCategories.length })}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {t('faq.stats.questions', { count: totalQuestions })}
          </Badge>
        </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <category.icon className="h-6 w-6 text-primary" />
                  {category.category}
                  <Badge variant="secondary" className="ml-auto">
                    {t('faq.card.questions', { count: category.questions.length })}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2">
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">{t('faq.contact.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('faq.contact.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="p-3 text-sm">
                {t('faq.contact.buttons.email')}
              </Badge>
              <Badge variant="outline" className="p-3 text-sm">
                {t('faq.contact.buttons.phone')}
              </Badge>
              <Badge variant="outline" className="p-3 text-sm">
                {t('faq.contact.buttons.chat')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FAQPage;
