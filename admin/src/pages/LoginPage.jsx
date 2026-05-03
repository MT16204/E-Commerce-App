import { SignIn, useAuth, useUser } from "@clerk/clerk-react";
import { useSearchParams, Navigate } from "react-router";

function LoginPage() {
  const [searchParams] = useSearchParams();
  const isUnauthorized = searchParams.get("error") === "unauthorized";

  return (
    <div className="h-screen hero flex flex-col items-center justify-center">
      {isUnauthorized && (
        <div className="alert alert-error mb-4 max-w-md">
          <span>⛔ You don't have admin access.</span>
        </div>
      )}
      <SignIn />
    </div>
  );
}

export default LoginPage;