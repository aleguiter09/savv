"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { signInWithEmail, user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  });

  async function handleSignIn(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (email && password) {
      try {
        const error = await signInWithEmail(email, password);
        if (error) {
          console.error("Error:", error);
          setError(error);
        }
      } catch (error) {
        console.error("Error:", (error as Error).message);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Error: Fill out both fields to login");
      setError("Fill out both fields to login");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Image src="/finance.png" height={160} width={250} alt="My finances" />
      <h2 className="mt-4 text-3xl font-extrabold">Sign in to your account</h2>
      <div className="mt-8 w-full max-w-md">
        <form className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
            ${error !== "" ? "border-red-500" : ""}`}
          />
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
              ${error !== "" ? "border-red-500" : ""}`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          {loading ? (
            <div className="mt-2 flex w-full justify-center rounded-md bg-blue-600 py-2">
              <output
                className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                aria-live="polite"
              />
            </div>
          ) : (
            <button
              className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white"
              onClick={handleSignIn}
            >
              Sign in
            </button>
          )}
          <p className="text-center text-sm">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-blue-600">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
