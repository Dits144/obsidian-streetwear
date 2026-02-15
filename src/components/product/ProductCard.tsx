import { Link } from "react-router-dom";
import { Product, formatPrice } from "@/data/products";
import { motion } from "framer-motion";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-3">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl font-extrabold uppercase text-muted-foreground/20 select-none">
              {product.category}
            </span>
          </div>
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1">
              {product.badge}
            </span>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium truncate group-hover:underline underline-offset-4">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
