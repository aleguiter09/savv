"use client";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/common/CustomInput";
import Button from "@/components/common/CustomButton";
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
    <div className="flex items-center justify-center px-6 py-12 flex-col">
      <Image src="/finance.png" height={160} width={250} alt="My finances" />
      <h2 className="text-3xl font-extrabold mt-4">Sign in to your account</h2>
      <div className="w-full mt-8 max-w-md">
        <form className="flex flex-col gap-3">
          <Input
            label="Email address"
            type="email"
            id="email"
            value={email}
            setValue={setEmail}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            setValue={setPassword}
          />
          <Button label="Sign in" onClick={handleSignIn} />
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
