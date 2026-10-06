import { Check, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AgreementTermsProps {
  terms: {
    title: string
    content: string
  }[]
}

export default function AgreementTerms({ terms }: AgreementTermsProps) {
  return (
    <div className="mt-10 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Terms & Conditions</h2>
        <p className="text-muted-foreground">Please review the following terms carefully</p>
      </div>

      <div className="p-4 border rounded-lg border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 mt-0.5 text-primary" />
          <div>
            <p className="font-medium text-primary">Important Notice</p>
            <p className="text-sm text-muted-foreground">
              By accepting this agreement, you acknowledge that you have read, understood, and agree to be bound by all
              terms and conditions outlined below.
            </p>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {terms.map((term, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
            <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-md">
              <div className="flex items-center gap-3 text-left">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>{term.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2 text-muted-foreground">{term.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
