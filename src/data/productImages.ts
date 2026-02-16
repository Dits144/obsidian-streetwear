import essentialOversizedTee from "@/assets/products/essential-oversized-tee.jpg";
import voidHoodie from "@/assets/products/void-hoodie.jpg";
import cargoTechPants from "@/assets/products/cargo-tech-pants.jpg";
import minimalCoachJacket from "@/assets/products/minimal-coach-jacket.jpg";
import logoCap from "@/assets/products/logo-cap.jpg";
import heavyweightCrewneck from "@/assets/products/heavyweight-crewneck.jpg";
import relaxedStraightJeans from "@/assets/products/relaxed-straight-jeans.jpg";
import graphicTeeVol3 from "@/assets/products/graphic-tee-vol3.jpg";
import pufferVest from "@/assets/products/puffer-vest.jpg";
import toteBag from "@/assets/products/tote-bag.jpg";
import zipUpHoodie from "@/assets/products/zip-up-hoodie.jpg";
import beanie from "@/assets/products/beanie.jpg";

export const productImageMap: Record<string, string> = {
  "essential-oversized-tee": essentialOversizedTee,
  "void-hoodie": voidHoodie,
  "cargo-tech-pants": cargoTechPants,
  "minimal-coach-jacket": minimalCoachJacket,
  "logo-cap": logoCap,
  "heavyweight-crewneck": heavyweightCrewneck,
  "relaxed-straight-jeans": relaxedStraightJeans,
  "graphic-tee-vol3": graphicTeeVol3,
  "puffer-vest": pufferVest,
  "tote-bag": toteBag,
  "zip-up-hoodie": zipUpHoodie,
  "beanie": beanie,
};

export function getProductImage(slug: string, fallback?: string): string {
  return productImageMap[slug] || fallback || "/placeholder.svg";
}
