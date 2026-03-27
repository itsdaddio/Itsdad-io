/**
 * client/src/data/productSalesTypes.ts
 *
 * Type definitions and data accessor for the 51-product sales funnel ecosystem.
 * Each product has a complete funnel: Tripwire → Order Bump → Upsell → Downsell.
 *
 * The raw data lives in productsSalesData.json and is loaded lazily to keep
 * the initial bundle lean.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InsideItem {
  title: string;
  desc: string;
}

export interface OrderBump {
  name: string;
  price: number;
  copy: string;
}

export interface Upsell {
  name: string;
  price: number;
  copy: string;
}

export interface Downsell {
  name: string;
  price: number;
  copy: string;
}

export interface ProductSalesData {
  id: number;
  name: string;
  category: string;
  headline: string;
  subheadline: string;
  problem: string;
  solution: string;
  whatsInside: string;
  insideItems: InsideItem[];
  tripwireSection: string;
  orderBump: OrderBump;
  upsell: Upsell;
  downsell: Downsell;
  guarantee: string;
  finalCta: string;
}

// ─── Funnel Step Enum ─────────────────────────────────────────────────────────

export type FunnelStep = "sales" | "order-bump" | "upsell" | "downsell" | "thank-you";

// ─── Data Loader ──────────────────────────────────────────────────────────────

import rawData from "./productsSalesData.json";

const allProducts: ProductSalesData[] = rawData as ProductSalesData[];

/** Get all 51 products */
export function getAllProductSalesData(): ProductSalesData[] {
  return allProducts;
}

/** Get a single product by ID (1–51) */
export function getProductSalesData(id: number): ProductSalesData | undefined {
  return allProducts.find((p) => p.id === id);
}

/** Get products by category */
export function getProductsByCategory(category: string): ProductSalesData[] {
  return allProducts.filter((p) => p.category === category);
}

/** Slug from product name (e.g., "AI STARTER KIT" → "ai-starter-kit") */
export function productSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Get product by slug */
export function getProductBySlug(slug: string): ProductSalesData | undefined {
  return allProducts.find((p) => productSlug(p.name) === slug);
}
