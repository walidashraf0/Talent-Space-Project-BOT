
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvestmentButtonProps {
  talentId: string;
  amount: number;
}

export function InvestmentButton({ talentId, amount }: InvestmentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInvestment = async () => {
    try {
      setLoading(true);
      
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-payment', {
        body: { talentId, amount }
      });

      if (checkoutError) throw checkoutError;
      
      // Redirect to Stripe checkout
      window.location.href = checkoutData.url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process investment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleInvestment} disabled={loading}>
      {loading ? "Processing..." : "Invest"}
    </Button>
  );
}
