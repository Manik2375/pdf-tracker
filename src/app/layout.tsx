import AuthProvider from "@/context/AuthProvider";
import "@/app/globals.css";
import { poppins } from "@/lib/fonts";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <AuthProvider>
        <body className={`${poppins.className} antialiased`}>{children}</body>
      </AuthProvider>
    </html>
  );
}
