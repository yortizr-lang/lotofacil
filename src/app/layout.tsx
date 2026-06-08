import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lotofácil',
  // Proyecto en construcción: no indexar en ningún buscador.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
