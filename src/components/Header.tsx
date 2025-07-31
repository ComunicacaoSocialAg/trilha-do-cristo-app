import { Mountain, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
const logoUrl = "/lovable-uploads/a59b0db8-6670-4d63-8cca-17c9dedacf24.png";

export function Header() {
  const navItems = [
    { label: "Início", href: "/#home" },
    { label: "Como Funciona", href: "/#how-it-works" },
    { label: "Galeria", href: "/#gallery" },
    { label: "Ranking", href: "/#ranking" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logoUrl} alt="Trilha do Cristo" className="h-10 w-10" />
            <div>
              <h1 className="font-bold text-xl text-primary">Trilha do Cristo</h1>
              <p className="text-xs text-muted-foreground">Poços de Caldas</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Entrar
              </Link>
            </Button>
            <Button variant="hero" size="sm" className="shadow-soft hover:shadow-medium" asChild>
              <Link to="/track">
                Começar Trilha
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium py-2 border-b border-border"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 mt-6">
                  <Button variant="outline" asChild>
                    <Link to="/login">
                      <User className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button variant="hero" asChild>
                    <Link to="/track">
                      Começar Trilha
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}