"use client";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/common/CustomInput";
import Button from "@/components/common/CustomButton";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    setError(null);
    if (email && name && password) {
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
    <div className="flex items-center justify-center px-6 py-12 flex-col">
      <Image src="/finance.png" height={160} width={250} alt="My finances" />
      <h2 className="text-3xl font-extrabold mt-4">Sign up!</h2>
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
            label="Name"
            type="input"
            id="name"
            value={name}
            setValue={setName}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            setValue={setPassword}
          />
          <Button label="Register" onClick={handleSignUp} />
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
