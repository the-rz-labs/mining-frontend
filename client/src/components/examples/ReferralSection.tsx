import ReferralSection from '../ReferralSection';

export default function ReferralSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <ReferralSection
        onLearnMore={() => console.log("Learn more about referral program")}
      />
    </div>
  );
}