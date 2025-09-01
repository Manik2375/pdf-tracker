import NavBar from "@/components/navigation/navBar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-base-300 p-2 w-full min-h-screen grid gap-5 grid-rows-[max-content_1fr] grid-cols-1 *:max-w-[60em] *:mx-auto">
      <NavBar />
      <main className="w-full max-w-[70em]">{children}</main>
    </div>
  );
}
