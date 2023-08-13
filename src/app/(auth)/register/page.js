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
    setLoading(true);
    setError("");
    if (email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      try {
        const error = await signUp(email, password);
        if (error) {
          console.error("Error:", error);
          setError(error);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Error: Fill out all fields to register");
      setError("Fill out all fields to register");
      setLoading(false);
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
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
            ${error !== "" ? "border-red-500" : ""}`}
          />
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
            ${error !== "" ? "border-red-500" : ""}`}
          />
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
            ${error !== "" ? "border-red-500" : ""}`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          {loading ? (
            <div className="mt-2 flex w-full justify-center rounded-md bg-blue-600 py-2">
              <div
                className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                role="status"
                aria-label="loading"
              ></div>
            </div>
          ) : (
            <button
              className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleSignUp}
            >
              Register
            </button>
          )}
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
