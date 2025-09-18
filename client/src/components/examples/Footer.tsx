import Footer from '../Footer';

export default function FooterExample() {
  return (
    <div className="bg-background">
      <Footer
        onContactClick={() => console.log("Contact clicked")}
        onNewsletterSignup={(email) => console.log("Newsletter signup:", email)}
      />
    </div>
  );
}