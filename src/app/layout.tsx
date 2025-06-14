import "@/app/ui/globals.css";
import { poppins } from "../lib/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
