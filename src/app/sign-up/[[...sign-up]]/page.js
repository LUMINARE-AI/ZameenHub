import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign Up | Asli Patta",
};

export default function SignUpPage() {
  return (
    <div className="flex justify-center py-8">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
