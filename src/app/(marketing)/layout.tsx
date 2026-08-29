/**
 * Marketing shell: canon fintech (gray + blue-600).
 * Cancels root body margin for full-bleed marketing.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="landing-marketing -mt-4 -mb-12 min-h-screen bg-white text-gray-900 antialiased selection:bg-blue-100 selection:text-gray-900">
      {children}
    </div>
  );
}
