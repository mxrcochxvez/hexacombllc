export default function BareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="review-bare">{children}</main>;
}
