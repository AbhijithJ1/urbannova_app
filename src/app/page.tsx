import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingContent from "@/components/landing/LandingContent";

export default async function Home() {
  const session = await auth();

  if (session) {
    if (session.user.role === "ADMIN") redirect("/admin/dashboard");
    redirect("/individual/dashboard");
  }

  return <LandingContent />;
}

