import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      wardId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    wardId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    wardId?: string | null;
  }
}
