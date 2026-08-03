import "./globals.css";

export const metadata = {
  title: "Evalora AI",
  description: "Multilingual Translation Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}