import Image from "next/image";
export const dynamic = "force-static";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Image
        src="/finance.png"
        height={160}
        width={250}
        alt="Savv Finances"
        priority
      />
      {children}
    </div>
  );
}
