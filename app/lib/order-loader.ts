"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartLine, Order, ShippingInfo } from "../../lib/types";

interface OrderWithDetails extends Order {
  items: Array<CartLine & { productName: string; productSlug: string; swatches: string[] }>;
  calculated?: {
    subtotal: number;
    tax: number;
    total: number;
    taxRate: number;
  };
  formatted?: {
    createdAt: string;
    subtotal: string;
    tax: string;
    total: string;
  };
}

interface UseOrderLoaderReturn {
  order: OrderWithDetails | null;
  loading: boolean;
  error: string | null;
  loadOrder: (orderId: string) => Promise<void>;
  clearOrder: () => void;
}

export function useOrderLoader(): UseOrderLoaderReturn {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async (orderId: string) => {
    if (!orderId) {
      setError("Order ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to load order: ${response.status}`);
      }

      const orderData: OrderWithDetails = await response.json();
      setOrder(orderData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load order";
      setError(message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOrder = useCallback(() => {
    setOrder(null);
    setError(null);
  }, []);

  return {
    order,
    loading,
    error,
    loadOrder,
    clearOrder,
  };
}

// Alternative: Simple function-based loader for non-component usage
export async function loadOrderDetails(orderId: string): Promise<OrderWithDetails> {
  const response = await fetch(`/api/orders/${orderId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to load order: ${response.status}`);
  }

  return response.json();
}

// Hook for order creation with optimistic updates
export function useOrderCreation() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (orderData: {
    lines: CartLine[];
    shipping: ShippingInfo;
    paymentMethod?: Order["paymentMethod"];
    subtotal?: number;
  }) => {
    setCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create order";
      setError(message);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  return {
    creating,
    error,
    createOrder,
  };
}