import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <main className="container py-20 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <CheckCircle className="h-16 w-16 mx-auto mb-6 text-foreground" strokeWidth={1} />
        <h1 className="font-display text-3xl font-bold uppercase mb-3">Order Confirmed</h1>
        <p className="text-muted-foreground mb-2">Thank you for your purchase!</p>
        <p className="text-xs text-muted-foreground mb-8">Order ID: {orderId?.slice(0, 8)}...</p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline"><Link to="/profile">View Orders</Link></Button>
          <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </motion.div>
    </main>
  );
}
