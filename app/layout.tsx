// sales_router_frontend/app/layout.tsx

import "./globals.css";
import { InitJobProgress } from "./_appInit";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Sales Router",
  description: "Plataforma Sales Router",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <InitJobProgress />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}

