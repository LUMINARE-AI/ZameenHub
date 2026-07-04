import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign In | ZameenHub",
};

export default function SignInPage() {
  return (
    <div className="flex justify-center py-8">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
