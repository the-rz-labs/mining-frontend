import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Search, BookOpen, MessageCircle, Zap, Shield, DollarSign, Users } from "lucide-react";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    badge: "New",
    color: "neon-green"
  },
  {
    id: "mining",
    title: "Mining Operations",
    icon: Zap,
    badge: "Popular",
    color: "neon-purple"
  },
  {
    id: "security",
    title: "Security & Safety",
    icon: Shield,
    badge: "Important",
    color: "mining-orange"
  },
  {
    id: "payments",
    title: "Payments & Withdrawals",
    icon: DollarSign,
    badge: "",
    color: "neon-green"
  },
  {
    id: "referrals",
    title: "Referral Program",
    icon: Users,
    badge: "",
    color: "neon-purple"
  }
];

const faqs = {
  "getting-started": [
    {
      question: "How do I start mining on the Ranking platform?",
      answer: "To start mining, first create an account and complete the verification process. Then navigate to the Dashboard, select a mining plan that suits your needs, and configure your mining settings. Your mining will begin automatically once payment is confirmed."
    },
    {
      question: "What are MGC and RZ tokens?",
      answer: "MGC (Mining Gold Coin) and RZ (Ranking Zone) are the two primary tokens on our platform. MGC is earned through mining operations and can be traded or withdrawn. RZ tokens are earned through staking and referral activities, providing additional rewards and platform benefits."
    },
    {
      question: "Do I need special hardware to mine?",
      answer: "No, you don't need any physical hardware. Our platform uses cloud mining technology, meaning we provide all the necessary mining equipment in our data centers. You simply purchase mining contracts and earn rewards without managing hardware yourself."
    }
  ],
  "mining": [
    {
      question: "How are mining rewards calculated?",
      answer: "Mining rewards are calculated based on your hash rate allocation, current network difficulty, and the mining plan you've selected. Rewards are distributed daily and can be viewed in your dashboard. The exact formula considers market conditions and operational costs."
    },
    {
      question: "Can I upgrade my mining plan?",
      answer: "Yes, you can upgrade your mining plan at any time from the Dashboard. The upgrade will take effect immediately, and you'll start earning at the new rate from the next payout cycle. Any existing contracts will continue until their expiration."
    },
    {
      question: "What happens if mining operations are interrupted?",
      answer: "Our mining operations have 99.9% uptime guarantee. In rare cases of interruption, your contracts are automatically extended to compensate for the downtime, ensuring you receive the full value of your mining plan."
    }
  ],
  "security": [
    {
      question: "How do you protect my funds and personal information?",
      answer: "We use bank-level security including SSL encryption, two-factor authentication, cold storage for funds, and regular security audits. Your personal information is never shared with third parties and is stored using advanced encryption protocols."
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
      answer: "Mining rewards are calculated daily and paid out every 24 hours directly to your account balance. You can then withdraw these rewards to your connected wallet at any time, subject to minimum withdrawal amounts."
    },
    {
      question: "What are the withdrawal fees and minimums?",
      answer: "Withdrawal fees vary by token: MGC has a 0.5% fee with a 10 MGC minimum, while RZ has a 0.3% fee with a 5 RZ minimum. These fees cover blockchain transaction costs and platform maintenance."
    },
    {
      question: "How long do withdrawals take to process?",
      answer: "Withdrawals are typically processed within 1-4 hours during business hours. Blockchain confirmation times vary, but most transactions complete within 10-30 minutes depending on network congestion."
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

function CategoryCard({ category, isSelected, onClick }: {
  category: typeof faqCategories[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 border ${
        isSelected
          ? 'border-neon-purple/50 bg-neon-purple/10'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
      }`}
      onClick={onClick}
      data-testid={`category-${category.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${category.color}/20 to-${category.color}/10 flex items-center justify-center border border-white/10`}>
              <category.icon className={`w-5 h-5 text-${category.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{category.title}</h3>
              <p className="text-xs text-white/60">{faqs[category.id as keyof typeof faqs].length} questions</p>
            </div>
          </div>
          {category.badge && (
            <Badge className={`bg-${category.color}/20 text-${category.color} border-${category.color}/50`}>
              {category.badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");

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

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          data-testid="button-search-faq"
        >
          <Search className="w-4 h-4 mr-2" />
          Search FAQ
        </Button>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          data-testid="button-contact-support"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-white">Categories</h2>
          <div className="space-y-2">
            {faqCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <HelpCircle className="w-5 h-5 text-neon-green" />
                <span>{faqCategories.find(c => c.id === selectedCategory)?.title}</span>
              </CardTitle>
              <CardDescription className="text-white/60">
                {faqs[selectedCategory as keyof typeof faqs].length} frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs[selectedCategory as keyof typeof faqs].map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-white/10"
                    data-testid={`faq-item-${index}`}
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

          {/* Contact Support Card */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg mt-6">
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
      </div>
    </div>
  );
}