// src/app/layout.jsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Document Intelligence Platform',
  description: 'Upload and ask questions about documents.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-black-200 p-4 mb-4 shadow">
          <Link href="/" className="mr-4 text-black-500 font-bold">Upload</Link>
          <Link href="/library" className="font-bold text-black-500">Library</Link>
        </nav>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
