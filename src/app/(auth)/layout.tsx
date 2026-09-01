import Image from "next/image";
export const dynamic = "force-static";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-6 mt-4 sm:mx-auto sm:w-lg lg:w-4xl">
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
    </main>
  );
}
