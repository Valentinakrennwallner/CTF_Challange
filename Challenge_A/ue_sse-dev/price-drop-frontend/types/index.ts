/**
 * Represents a product in the application.
 * This is the canonical interface used throughout the frontend.
 */
export interface Product {
  id: string; // The API uses a string for the ID, so we will too.
  name: string;
  price: number; // Price in the smallest currency unit (e.g., cents)
  image_url: string;
  description?: string;
  quantity?: number; // Optional, only used for items within the cart
}
