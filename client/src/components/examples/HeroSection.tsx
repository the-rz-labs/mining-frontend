import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onStartMining={() => console.log("Start Mining clicked")}
        onLearnMore={() => console.log("Learn More clicked")}
      />
    </div>
  );
}