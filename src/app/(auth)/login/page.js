"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { signInWithEmail, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  });

  async function handleSignIn(e) {
    e.preventDefault();
    setError(null);
    if (email && password) {
      try {
        const error = await signInWithEmail(email, password);
        if (error) {
          console.error("Error:", e);
          setError(error);
        }
      } catch (e) {
        console.error("Error:", e);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      <Image src="/finance.png" height={160} width={250} alt="My finances" />
      <h2 className="mt-4 text-3xl font-extrabold">Sign in to your account</h2>
      <div className="mt-8 w-full max-w-md">
        <form className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className="rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            />
          </div>
          <button
            className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={handleSignIn}
          >
            Sign in
          </button>
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
