import Navigation from '../Navigation';

export default function NavigationExample() {
  return (
    <Navigation
      onSignIn={() => console.log("Sign In clicked")}
      onSignUp={() => console.log("Sign Up clicked")}
    />
  );
}