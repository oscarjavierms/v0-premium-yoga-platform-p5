import Link from "next/link"

const footerLinks = {
  plataforma: [
    { name: "Clases", href: "/clases" },
    { name: "Profesores", href: "/profesores" },
    { name: "Membresía", href: "/membresia" },
    { name: "Método", href: "/metodo" },
  ],
  soporte: [
    { name: "FAQ", href: "/faq" },
    { name: "Contacto", href: "/contacto" },
    { name: "Centro de ayuda", href: "/ayuda" },
  ],
  legal: [
    { name: "Privacidad", href: "/privacidad" },
    { name: "Términos", href: "/terminos" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-2xl tracking-tight">
              TU ACADEMIA
            </Link>
            <p className="mt-4 text-sm text-background/60 leading-relaxed">
              Bienestar que sostiene vidas exigentes. Un sistema de bienestar funcional para personas que lideran.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.plataforma.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-4">Soporte</h3>
            <ul className="space-y-3">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10">
          <p className="text-xs text-background/40 text-center">
            © {new Date().getFullYear()} Tu Academia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
