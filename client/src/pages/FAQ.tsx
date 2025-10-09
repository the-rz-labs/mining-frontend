import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, MessageCircle, Zap, Shield, DollarSign, Users } from "lucide-react";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    color: "neon-green"
  },
  {
    id: "mining",
    title: "Mining Operations",
    icon: Zap,
    color: "neon-purple"
  },
  {
    id: "security",
    title: "Security & Safety",
    icon: Shield,
    color: "mining-orange"
  },
  {
    id: "payments",
    title: "Payments & Withdrawals",
    icon: DollarSign,
    color: "neon-green"
  },
  {
    id: "referrals",
    title: "Referral Program",
    icon: Users,
    color: "neon-purple"
  }
];

const faqs = {
  "getting-started": [
    {
      question: "How do I start mining on the Ranking platform?",
      answer: "You can simply login to your account, choose a plan and start it if you have enough tokens in your wallet. We do not get your money, we just check your balance to verify you have sufficient funds."
    },
    {
      question: "What are MGC and RZ tokens?",
      answer: "The MGC (Meta Games Coin) token is a specialized digital currency. It is a multifaceted tool within our ecosystem, allowing gamers to earn, trade, and utilize tokens through various gaming activities."
    },
    {
      question: "Do I need special hardware to mine?",
      answer: "No, you don't need any special hardware to mine on our platform."
    }
  ],
  "mining": [
    {
      question: "How are mining rewards calculated?",
      answer: "Mining rewards are calculated based on the rate of your miners, using a formula that operates in seconds. You can see your live earnings in real-time, updating every second on your dashboard."
    },
    {
      question: "Can I upgrade my mining plan?",
      answer: "Yes, in the Miners page you can upgrade or downgrade (replace) your miner with another one at any time."
    },
    {
      question: "What happens if mining operations are interrupted?",
      answer: "Mining operations are never interrupted on our platform."
    }
  ],
  "security": [
    {
      question: "How do you protect my funds and personal information?",
      answer: "There is no deposit into this platform, so your money stays in your wallet and remains safe. The platform itself is also secure, ensuring your personal information is protected."
    },
    {
      question: "Is my wallet connection secure?",
      answer: "Yes, wallet connections use industry-standard protocols like WalletConnect and MetaMask integration. We never store your private keys, and all transactions require your explicit approval through your wallet interface."
    },
    {
      question: "What should I do if I suspect unauthorized account access?",
      answer: "If you suspect unauthorized access, immediately change your password, enable 2FA if not already active, and contact our support team. We monitor all accounts for suspicious activity and will help secure your account quickly."
    }
  ],
  "payments": [
    {
      question: "How often are mining rewards paid out?",
      answer: "You can claim your rewards at any time with no limit. There are no restrictions on how frequently you can withdraw your earnings."
    },
    {
      question: "What are the withdrawal fees and minimums?",
      answer: "There is no minimum withdrawal amount. You only need to pay the transaction fee when claiming your rewards."
    },
    {
      question: "How long do withdrawals take to process?",
      answer: "Withdrawals are processed instantly. It takes 1-2 minutes after your transaction succeeds on the blockchain."
    }
  ],
  "referrals": [
    {
      question: "How does the referral program work?",
      answer: "Share your unique referral code with friends. When they sign up and make their first purchase, you earn 10% of their mining rewards for the first month, plus bonus RZ tokens. There's no limit to how many people you can refer."
    },
    {
      question: "When do I receive referral rewards?",
      answer: "Referral rewards are paid out weekly on Sundays. You can track your referral earnings in the Profile section, including pending and paid rewards, as well as the number of active referrals."
    },
    {
      question: "Can I refer someone who already has an account?",
      answer: "No, referral rewards only apply to new users who sign up using your referral code. Existing users cannot be retroactively linked to your referral program, so make sure to share your code before they register."
    }
  ]
};

export default function FAQ() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-white/60">
          Find answers to common questions about mining, security, and platform features
        </p>
      </div>

      {/* FAQ Categories */}
      {faqCategories.map((category) => (
        <Card key={category.id} className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <category.icon className={`w-5 h-5 text-${category.color}`} />
              <span>{category.title}</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              {faqs[category.id as keyof typeof faqs].length} frequently asked questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs[category.id as keyof typeof faqs].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-white/10"
                  data-testid={`faq-item-${category.id}-${index}`}
                >
                  <AccordionTrigger className="text-white hover:text-neon-purple text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {/* Contact Support Card */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-neon-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Still need help?</h3>
              <p className="text-white/60 mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <Button
                className="bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/80 hover:to-purple-600/80"
                data-testid="button-contact-support-bottom"
              >
                Contact Support Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}