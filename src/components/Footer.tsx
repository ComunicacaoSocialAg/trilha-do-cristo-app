import { Mountain, MapPin, Mail, Heart } from "lucide-react";
const logoUrl = "/lovable-uploads/a59b0db8-6670-4d63-8cca-17c9dedacf24.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    sobre: [
      { label: "O Projeto", href: "#" },
      { label: "Como Funciona", href: "#how-it-works" },
      { label: "Ranking", href: "#ranking" },
      { label: "Galeria", href: "#gallery" }
    ],
    comunidade: [
      { label: "WhatsApp", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "Eventos", href: "#" }
    ],
    suporte: [
      { label: "FAQ", href: "#" },
      { label: "Contato", href: "#" },
      { label: "Reportar Bug", href: "#" },
      { label: "Sugestões", href: "#" }
    ]
  };

  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logoUrl} alt="Trilha do Cristo" className="h-10 w-10" />
              <div>
                <h3 className="font-bold text-xl">Trilha do Cristo</h3>
                <p className="text-sm text-white/70">Poços de Caldas</p>
              </div>
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              A maior comunidade de trilheiros de Poços de Caldas. 
              Conectando pessoas através do esporte e do amor pela natureza.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white/70">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Poços de Caldas, MG
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                contato@trilhadocristo.com
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Sobre</h4>
            <ul className="space-y-2">
              {footerLinks.sobre.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Comunidade</h4>
            <ul className="space-y-2">
              {footerLinks.comunidade.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2">
              {footerLinks.suporte.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-white/70 mb-4 md:mb-0">
              <span>© {currentYear} Trilha do Cristo. Feito com</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>em Poços de Caldas</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/70">
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}