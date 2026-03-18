import "./globals.css"

export const metadata = {
  title: "middleman",
  description: "Landing page",
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  )
}
