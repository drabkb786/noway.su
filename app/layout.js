import "./globals.css";

export const metadata = {
  title: "Sindh University Title Page Generator",
  description: "Generate password protected title pages for assignments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}