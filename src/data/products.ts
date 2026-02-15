export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  categorySlug: string;
  description: string;
  material: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  images: string[];
  badge?: "New" | "Limited" | "Best Seller";
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  { id: "1", name: "T-Shirts", slug: "t-shirts", image: "" },
  { id: "2", name: "Hoodies", slug: "hoodies", image: "" },
  { id: "3", name: "Jackets", slug: "jackets", image: "" },
  { id: "4", name: "Pants", slug: "pants", image: "" },
  { id: "5", name: "Accessories", slug: "accessories", image: "" },
];

const placeholder = "/placeholder.svg";

export const products: Product[] = [
  {
    id: "1", name: "Essential Oversized Tee", slug: "essential-oversized-tee",
    price: 450000, category: "T-Shirts", categorySlug: "t-shirts",
    description: "Premium heavyweight cotton oversized tee. Relaxed fit with dropped shoulders for an effortlessly cool silhouette.",
    material: "100% Premium Cotton 280gsm", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }, { name: "White", hex: "#fff" }],
    stock: 45, images: [placeholder], badge: "Best Seller", rating: 4.8, reviewCount: 124
  },
  {
    id: "2", name: "Void Hoodie", slug: "void-hoodie",
    price: 890000, compareAtPrice: 1200000, category: "Hoodies", categorySlug: "hoodies",
    description: "Our signature hoodie. Heavy fleece, kangaroo pocket, ribbed cuffs. The ultimate comfort piece.",
    material: "80% Cotton 20% Polyester 400gsm", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }, { name: "Charcoal", hex: "#333" }],
    stock: 30, images: [placeholder], badge: "Limited", rating: 4.9, reviewCount: 89
  },
  {
    id: "3", name: "Cargo Tech Pants", slug: "cargo-tech-pants",
    price: 780000, category: "Pants", categorySlug: "pants",
    description: "Technical cargo pants with adjustable hem. Water-resistant finish, multiple utility pockets.",
    material: "Nylon/Cotton Blend", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }, { name: "Olive", hex: "#556B2F" }],
    stock: 22, images: [placeholder], badge: "New", rating: 4.7, reviewCount: 56
  },
  {
    id: "4", name: "Minimal Coach Jacket", slug: "minimal-coach-jacket",
    price: 1250000, category: "Jackets", categorySlug: "jackets",
    description: "Clean-lined coach jacket. Snap button closure, lightweight shell. Perfect layering piece.",
    material: "100% Nylon Shell", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }],
    stock: 15, images: [placeholder], rating: 4.6, reviewCount: 34
  },
  {
    id: "5", name: "Logo Cap", slug: "logo-cap",
    price: 280000, category: "Accessories", categorySlug: "accessories",
    description: "Embroidered logo cap. Adjustable strap closure. Structured crown.",
    material: "100% Cotton Twill", sizes: ["One Size"], colors: [{ name: "Black", hex: "#000" }, { name: "White", hex: "#fff" }],
    stock: 60, images: [placeholder], badge: "Best Seller", rating: 4.5, reviewCount: 201
  },
  {
    id: "6", name: "Heavyweight Crewneck", slug: "heavyweight-crewneck",
    price: 720000, compareAtPrice: 950000, category: "Hoodies", categorySlug: "hoodies",
    description: "Premium heavyweight crewneck sweatshirt. Brushed fleece interior for supreme comfort.",
    material: "100% Cotton Fleece 380gsm", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }, { name: "Grey", hex: "#999" }],
    stock: 28, images: [placeholder], rating: 4.7, reviewCount: 67
  },
  {
    id: "7", name: "Relaxed Straight Jeans", slug: "relaxed-straight-jeans",
    price: 850000, category: "Pants", categorySlug: "pants",
    description: "Washed black straight-leg jeans. Relaxed fit through hip and thigh.",
    material: "100% Cotton Denim 14oz", sizes: ["S","M","L","XL"], colors: [{ name: "Washed Black", hex: "#1a1a1a" }],
    stock: 18, images: [placeholder], rating: 4.4, reviewCount: 42
  },
  {
    id: "8", name: "Graphic Tee — Vol.3", slug: "graphic-tee-vol3",
    price: 520000, category: "T-Shirts", categorySlug: "t-shirts",
    description: "Limited edition graphic tee from our Volume 3 collection. Screen-printed artwork.",
    material: "100% Premium Cotton 250gsm", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }],
    stock: 12, images: [placeholder], badge: "Limited", rating: 4.8, reviewCount: 31
  },
  {
    id: "9", name: "Puffer Vest", slug: "puffer-vest",
    price: 1100000, compareAtPrice: 1400000, category: "Jackets", categorySlug: "jackets",
    description: "Lightweight puffer vest with matte finish. Packable design for easy travel.",
    material: "Recycled Nylon / Synthetic Fill", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }],
    stock: 8, images: [placeholder], badge: "New", rating: 4.6, reviewCount: 19
  },
  {
    id: "10", name: "Tote Bag", slug: "tote-bag",
    price: 350000, category: "Accessories", categorySlug: "accessories",
    description: "Heavy-duty canvas tote bag with internal pockets. Embossed logo detail.",
    material: "16oz Canvas", sizes: ["One Size"], colors: [{ name: "Black", hex: "#000" }, { name: "Natural", hex: "#f5f0e8" }],
    stock: 40, images: [placeholder], rating: 4.3, reviewCount: 88
  },
  {
    id: "11", name: "Zip-Up Hoodie", slug: "zip-up-hoodie",
    price: 950000, category: "Hoodies", categorySlug: "hoodies",
    description: "Full-zip hoodie with metal YKK zipper. Split kangaroo pockets.",
    material: "80% Cotton 20% Polyester 380gsm", sizes: ["S","M","L","XL"], colors: [{ name: "Black", hex: "#000" }, { name: "Heather Grey", hex: "#b0b0b0" }],
    stock: 25, images: [placeholder], rating: 4.7, reviewCount: 53
  },
  {
    id: "12", name: "Beanie", slug: "beanie",
    price: 220000, category: "Accessories", categorySlug: "accessories",
    description: "Ribbed knit beanie with embroidered logo. One size fits most.",
    material: "100% Acrylic", sizes: ["One Size"], colors: [{ name: "Black", hex: "#000" }, { name: "Grey", hex: "#666" }],
    stock: 50, images: [placeholder], rating: 4.4, reviewCount: 112
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
};
