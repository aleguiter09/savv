"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    setError(null);
    if (email && password && confirmPassword) {
      try {
        const error = await signUp(email, password);
        if (error) {
          console.error("Error:", e);
          console.log(error);
        }
      } catch (e) {
        console.error("Error:", e);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      <Image src="/finance.png" height={160} width={250} alt="My finances" />
      <h2 className="mt-4 text-3xl font-extrabold">Sign up!</h2>
      <div className="mt-8 w-full max-w-md">
        <form className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className="rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          />
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className="rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          />
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            className="rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          />
          <button
            className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={handleSignUp}
          >
            Register
          </button>
          <p className="text-center text-sm">
            {"Already have an account? "}
            <Link href="/" className="font-semibold text-blue-600">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
