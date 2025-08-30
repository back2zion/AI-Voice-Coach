import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "local-development",
  routes: {
    afterSignIn: "/dashboard", // Add this line to redirect to dashboard after sign in
    afterSignUp: "/dashboard", // Also redirect after sign up
    signIn: "/handler/sign-in",
    signUp: "/handler/sign-up"
  }
});
