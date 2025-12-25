import AuthProvider from "@/context/AuthProvider";
import "@/app/globals.css";
import { poppins } from "@/lib/fonts";
import React from "react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/context/ThemeProvider";

export const metadata: Metadata = {
	title: {
		default: "PDF Tracker",
		template: "%s | PDF Tracker",
	},
	description:
		"Track, analyze, and optimize how you interact with your PDFs. Get insights like time spent, page views, and more with PDF Owl.",
	keywords: [
		"PDF tracker",
		"PDF analytics",
		"document usage",
		"reading time",
		"page tracking",
		"PDF Owl",
	],
	metadataBase: new URL("https://yourdomain.com"),

	icons: {
		icon: [{ url: "/favicon.png", sizes: "192x192", type: "image/png" }],
		apple: "/favicon.png",
	},

	openGraph: {
		title: "PDF Tracker: Track your pdfs",
		description: "Track your pdfs and sync progress across all devices.",
		url: "https://yourdomain.com",
		siteName: "PDF Owl",
		images: [
			{
				url: "https://res.cloudinary.com/theowl/image/upload/v1753277926/13d292bb-a2ba-4a89-9f85-ededeb790bc1.png",
				width: 300,
				height: 300,
				alt: "PDF Owl – Smart PDF Tracker",
			},
		],
		locale: "en_US",
		type: "website",
	},

	twitter: {
		card: "summary_large_image",
		title: "PDF Owl – Smart PDF Usage Tracker",
		description:
			"See how users interact with your PDFs. Visualize reading patterns and time spent per page.",
		images: [
			"https://res.cloudinary.com/theowl/image/upload/v1753277926/13d292bb-a2ba-4a89-9f85-ededeb790bc1.png",
		],
	},
	other: {
		"google-site-verification": "Hk55yiJ8HbErfNwlPSAgCh2iRTeFvCdIhFtkyVCXdY4",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<AuthProvider>
				<ThemeProvider>
					<body className={`${poppins.className} antialiased w-full min-h-screen`}>
						{children}
						<Analytics />
					</body>
				</ThemeProvider>
			</AuthProvider>
		</html>
	);
}
