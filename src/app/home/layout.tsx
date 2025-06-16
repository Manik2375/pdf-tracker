import NavBar from "@/components/navigation/navBar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrapper">
        <NavBar />
        <main>
          {children}
        </main>
    </div>
  );
}
