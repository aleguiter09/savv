import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Image src="/finance.png" height={160} width={250} alt="My finances" />
      {children}
    </div>
  );
}
