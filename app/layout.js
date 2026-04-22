import './globals.css'

export const metadata = {
  title: 'Black Pepper Media — Client OS',
  description: 'Premium content management dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}