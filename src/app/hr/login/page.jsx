import { HrLoginForm } from "@/components/hr/login";

export const metadata = {
  title: "HR Portal Sign In | meelTe Operations",
  description: "Secure login for authorized meelTe HR operations and recruitment management personnel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HrLoginPage() {
  return <HrLoginForm />;
}
