import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const products = [
  {
    id: 1,
    name: "Camiseta Trilha do Cristo",
    description: "Camiseta 100% algodão com logo da trilha",
    price: 45.90,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    category: "Vestuário",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "Boné Trilha do Cristo",
    description: "Boné com proteção UV e logo bordado",
    price: 32.90,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop",
    category: "Vestuário",
    rating: 4.9,
    inStock: true
  },
  {
    id: 3,
    name: "Garrafa Térmica 500ml",
    description: "Garrafa térmica inox mantém temperatura por 12h",
    price: 68.90,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
    category: "Equipamentos",
    rating: 4.7,
    inStock: true
  },
  {
    id: 4,
    name: "Cantil de Alumínio",
    description: "Cantil resistente e leve para trilhas",
    price: 25.90,
    image: "https://images.unsplash.com/photo-1544966503-7cc531dc4d82?w=300&h=300&fit=crop",
    category: "Equipamentos",
    rating: 4.6,
    inStock: false
  },
  {
    id: 5,
    name: "Pelúcia Macaco Bugio",
    description: "Pelúcia fofa do mascote da trilha",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    category: "Souvenirs",
    rating: 4.9,
    inStock: true
  },
  {
    id: 6,
    name: "Chaveiro Trilha do Cristo",
    description: "Chaveiro em metal com formato da montanha",
    price: 12.90,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    category: "Souvenirs",
    rating: 4.5,
    inStock: true
  },
  {
    id: 7,
    name: "Mochila de Trilha 30L",
    description: "Mochila resistente com compartimentos",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "Equipamentos",
    rating: 4.8,
    inStock: true
  },
  {
    id: 8,
    name: "Toalha de Trilha",
    description: "Toalha de microfibra compacta e absorvente",
    price: 28.90,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop",
    category: "Equipamentos",
    rating: 4.4,
    inStock: true
  }
];

const categories = ["Todos", "Vestuário", "Equipamentos", "Souvenirs"];

const Loja = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  const filteredProducts = selectedCategory === "Todos" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { id: productId, quantity: 1 }];
      }
    });
    
    const product = products.find(p => p.id === productId);
    toast({
      title: "Produto adicionado!",
      description: `${product?.name} foi adicionado ao carrinho.`,
    });
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Loja da Trilha
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Produtos oficiais da Trilha do Cristo
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="secondary" className="text-primary">
                Entrega em todo Brasil
              </Badge>
              <Badge variant="secondary" className="text-primary">
                Produtos Oficiais
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Cart */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex space-x-2 mb-4 md:mb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrinho ({getTotalItems()})
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                    {!product.inStock && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-2 left-2"
                      >
                        Esgotado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription className="text-sm mb-3">
                    {product.description}
                  </CardDescription>
                  
                  <div className="text-2xl font-bold text-primary">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    onClick={() => addToCart(product.id)}
                    disabled={!product.inStock}
                    variant={product.inStock ? "default" : "secondary"}
                  >
                    {product.inStock ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar ao Carrinho
                      </>
                    ) : (
                      "Produto Esgotado"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Loja;