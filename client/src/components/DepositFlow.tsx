import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  Sparkles, 
  Users, 
  ArrowRight,
  Shield,
  Clock,
  Gift,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DepositFlowProps {
  onComplete?: (data: DepositData) => void;
  cohortName?: string;
  depositAmount?: number;
  spotsRemaining?: number;
}

interface DepositData {
  email: string;
  fullName: string;
  amount: number;
  paymentIntentId?: string;
}

const benefits = [
  { icon: Users, text: "Priority access to first cohort" },
  { icon: Gift, text: "Exclusive early-bird pricing" },
  { icon: Clock, text: "Lifetime founding member status" },
  { icon: Shield, text: "100% refundable if not satisfied" },
];

export function DepositFlow({ 
  onComplete, 
  cohortName = "Spring 2026 Cohort",
  depositAmount = 49,
  spotsRemaining = 47
}: DepositFlowProps) {
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
  });

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate Stripe payment (test mode)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const depositData: DepositData = {
      ...formData,
      amount: depositAmount,
      paymentIntentId: `pi_test_${Date.now()}`,
    };
    
    setIsLoading(false);
    setStep("success");
    onComplete?.(depositData);
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-2 border-primary/20 shadow-xl">
      {/* Animated gradient header */}
      <div className="relative h-2 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer" />
      
      <AnimatePresence mode="wait">
        {step === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Reserve Your Spot</CardTitle>
              <CardDescription className="text-base">
                Join the <span className="font-semibold text-foreground">{cohortName}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Urgency indicator */}
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-accent/10 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">
                  Only <span className="text-primary font-bold">{spotsRemaining}</span> spots remaining
                </span>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              <Separator />

              {/* Form */}
              <form onSubmit={handleSubmitInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold group">
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </CardContent>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Secure Your Deposit</CardTitle>
              <CardDescription>
                Refundable deposit for {formData.fullName || "your spot"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Amount display */}
              <div className="text-center py-6 bg-muted/50 rounded-xl">
                <div className="text-4xl font-bold text-primary">${depositAmount}</div>
                <div className="text-sm text-muted-foreground mt-1">One-time refundable deposit</div>
              </div>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Stripe Secure</span>
                </div>
              </div>

              {/* Demo payment form */}
              <div className="space-y-4 p-4 border rounded-lg bg-card">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Card Number</Label>
                  <Input 
                    placeholder="4242 4242 4242 4242" 
                    className="font-mono"
                    defaultValue="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Expiry</Label>
                    <Input placeholder="MM/YY" defaultValue="12/28" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">CVC</Label>
                    <Input placeholder="123" defaultValue="123" />
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  🧪 Test Mode - No real charge
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("info")}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePayment}
                  className="flex-1 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ${depositAmount}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CardHeader className="text-center pb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                You're In! 🎉
              </CardTitle>
              <CardDescription className="text-base">
                Your spot in the {cohortName} is secured
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <div className="py-4 px-6 bg-muted/50 rounded-xl space-y-2">
                <div className="text-sm text-muted-foreground">Confirmation sent to</div>
                <div className="font-medium">{formData.email}</div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Thank you for believing in NuFounders!</p>
                <p>We'll contact you soon with next steps.</p>
              </div>

              <div className="pt-4">
                <Badge variant="outline" className="text-xs px-3 py-1">
                  Founding Member #{1000 - spotsRemaining + 1}
                </Badge>
              </div>
            </CardContent>

            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                Done
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Compact CTA version for embedding in other pages
export function DepositCTA({ className }: { className?: string }) {
  const [showFlow, setShowFlow] = useState(false);

  if (showFlow) {
    return (
      <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4", className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button 
            variant="ghost" 
            className="absolute top-4 right-4"
            onClick={() => setShowFlow(false)}
          >
            ✕
          </Button>
          <DepositFlow onComplete={() => setTimeout(() => setShowFlow(false), 3000)} />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 cursor-pointer",
        "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground",
        "shadow-lg hover:shadow-xl transition-shadow",
        className
      )}
      onClick={() => setShowFlow(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Reserve Your Spot</h3>
          <p className="text-sm opacity-90">Join the Spring 2026 founding cohort</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">$49</div>
          <Badge variant="secondary" className="text-xs">47 spots left</Badge>
        </div>
      </div>
    </motion.div>
  );
}
