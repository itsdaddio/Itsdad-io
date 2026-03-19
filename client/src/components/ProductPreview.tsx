/**
 * ProductPreview — Public-facing product catalog preview
 * Shows product categories and sample product names to visitors BEFORE signup
 * Reduces friction by letting visitors see what they'll get access to
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Sparkles,
  Share2,
  ShoppingCart,
  DollarSign,
  User,
  Megaphone,
  ArrowRight,
  Lock,
  Crown,
  Eye,
  Package
} from "lucide-react";
import { PRODUCTS_51, PRODUCT_CATEGORIES } from "@/data/products51";
import { useState } from "react";

const CATEGORY_IMAGES: Record<string, string> = {
  "AI Tools": "/images/cover-ai-tools.jpg",
  "Social Media": "/images/cover-social-media.jpg",
  "E-commerce": "/images/cover-ecommerce.jpg",
  "Finance": "/images/cover-finance.jpg",
  "Personal Development": "/images/cover-personal-dev.jpg",
  "Marketing": "/images/cover-marketing.jpg",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "AI Tools": <Sparkles className="w-5 h-5" />,
  "Social Media": <Share2 className="w-5 h-5" />,
  "E-commerce": <ShoppingCart className="w-5 h-5" />,
  "Finance": <DollarSign className="w-5 h-5" />,
  "Personal Development": <User className="w-5 h-5" />,
  "Marketing": <Megaphone className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  "AI Tools": "text-purple-400 bg-purple-500/20 border-purple-500/30",
  "Social Media": "text-pink-400 bg-pink-500/20 border-pink-500/30",
  "E-commerce": "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
  "Finance": "text-green-400 bg-green-500/20 border-green-500/30",
  "Personal Development": "text-amber-400 bg-amber-500/20 border-amber-500/30",
  "Marketing": "text-blue-400 bg-blue-500/20 border-blue-500/30",
};

// Group products by broad category for display
// Products 1-10 are the "Digital Products" foundation tier with varied sub-categories
// We group them by the 6 broad categories from PRODUCT_CATEGORIES
function getProductsByCategory() {
  const groups: Record<string, typeof PRODUCTS_51> = {};
  for (const p of PRODUCTS_51) {
    const cat = p.category;
    let broadCat = cat;
    // Products 1-10 are all foundational digital/AI tools
    if (p.id <= 10) broadCat = "AI Tools";
    else if (["Social Media", "Traffic", "Content", "YouTube"].includes(cat)) broadCat = "Social Media";
    else if (["E-commerce", "Digital Products"].includes(cat)) broadCat = "E-commerce";
    else if (["Finance", "Crypto", "Investing", "Real Estate", "Income"].includes(cat)) broadCat = "Finance";
    else if (["Personal Development", "Productivity", "Health", "Lifestyle", "Networking", "Leadership", "Bundle"].includes(cat)) broadCat = "Personal Development";
    else if (["Marketing", "Advertising", "Email Marketing", "SEO", "Funnels", "Copywriting", "Web Design", "Lead Generation", "Sales", "Blogging", "Coaching", "Freelancing", "Agency", "Memberships", "Education", "Branding", "Business Skills"].includes(cat)) broadCat = "Marketing";

    if (!groups[broadCat]) groups[broadCat] = [];
    groups[broadCat].push(p);
  }
  return groups;
}

export function ProductPreview() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const grouped = getProductsByCategory();

  return (
    <div>
      <div className="text-center mb-10">
        <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
          <Eye className="w-3 h-3 mr-1 inline" />
          Preview Our Product Catalog
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          <span className="text-amber-400">51 Products</span> Across 6 Categories
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Every product comes with sales pages, email swipes, and ad copy — ready to promote the moment you join.
        </p>
      </div>

      {/* Category Cards with Product Names */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
        {PRODUCT_CATEGORIES.map((cat) => {
          const products = grouped[cat.name] || [];
          const isExpanded = expandedCategory === cat.name;
          const displayProducts = isExpanded ? products : products.slice(0, 4);
          const colorClass = CATEGORY_COLORS[cat.name] || "text-gray-400 bg-gray-500/20 border-gray-500/30";
          const iconColor = colorClass.split(" ")[0];

          return (
            <Card
              key={cat.name}
              className="border-border hover:border-emerald-500/30 transition-all bg-card/50 overflow-hidden group"
            >
              {/* Category Cover Image */}
              {CATEGORY_IMAGES[cat.name] && (
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={CATEGORY_IMAGES[cat.name]}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className={`absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg ${colorClass} backdrop-blur-sm`}>
                    {CATEGORY_ICONS[cat.name] || <Package className="w-5 h-5" />}
                    <span className="font-bold text-sm">{cat.name}</span>
                  </div>
                </div>
              )}
              <CardContent className="p-6">
                {/* Category Header — only show if no image */}
                {!CATEGORY_IMAGES[cat.name] && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      {CATEGORY_ICONS[cat.name] || <Package className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">{products.length} products</p>
                    </div>
                  </div>
                )}
                {/* Product count + category description when image is shown */}
                {CATEGORY_IMAGES[cat.name] && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground">{products.length} products</p>
                    <p className="text-xs text-slate-400 italic mt-1 leading-relaxed">{cat.description}</p>
                  </div>
                )}

                {/* Product Names List with descriptions */}
                <div className="space-y-3 mb-4">
                  {displayProducts.map((product) => (
                    <div key={product.id} className="flex flex-col gap-0.5 text-sm border-b border-border/20 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${iconColor.replace("text-", "bg-")}`} />
                        <span className="text-foreground/90 font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">${product.tripwire}</span>
                      </div>
                      {product.description && (
                        <p className="text-xs text-muted-foreground pl-3.5 leading-relaxed">{product.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Show More / Less */}
                {products.length > 4 && (
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                    className={`text-xs font-medium ${iconColor} hover:underline`}
                  >
                    {isExpanded ? "Show less" : `+ ${products.length - 4} more products`}
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          <Lock className="w-3.5 h-3.5 inline mr-1" />
          Full product details, affiliate links, and marketing materials unlock with membership
        </p>
        <Link href="/memberships">
          <Button size="lg" className="btn-gold-gradient text-lg px-8 py-6 h-auto rounded-xl gold-shimmer hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 mr-2" />
            Unlock All 51 Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
