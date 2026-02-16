import { Link } from "react-router-dom";
import { type DBProduct, getImageUrl, formatPrice } from "@/hooks/useProducts";
import { motion } from "framer-motion";

interface Props {
  product: DBProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const imageUrl = getImageUrl(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-3">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1">
              {product.badge}
            </span>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium truncate group-hover:underline underline-offset-4">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
