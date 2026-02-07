export const metadata = {
  title: 'NEXORA Admin',
  description: 'Painel administrativo do Ecossistema NEXORA'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'ui-sans-serif, system-ui', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
