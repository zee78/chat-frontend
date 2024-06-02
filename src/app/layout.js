import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Peek Chat",
  description: "Peek Chat - premium live chat software for business. Realtime messenger to make your communication with customers as easy and enjoyable while chatting.",
  keywords: "chat, live, realtime, system, application, messenger, chatting, integration, plugin, library, wordpress, laravel, buddypress, joomla, php, moosocial, codeigniter, community builder, xenforo,real time chat system in laravel, laravel Chat, socket chat, live chat,real-time messaging, real-time,real-time chat"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
