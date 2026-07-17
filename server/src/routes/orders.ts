import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase.js";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        swatch: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shipping: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(7),
    // The checkout form's controlled input always sends "" for an empty
    // optional field, never `undefined` — .optional() alone only skips
    // validation when the key is missing entirely, so an empty string
    // was still being run through .email() and rejected. Normalize first.
    email: z.preprocess((val) => (val === "" ? undefined : val), z.string().email().optional()),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    note: z.string().optional(),
  }),
  paymentMethod: z.enum(["Store Pickup", "Bank Transfer"]),
});

function generateOrderId() {
  return `VR-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
}

/**
 * Loads an order with all related data including items and product details.
 * This loader performs eager loading to minimize database round trips and includes
 * calculated totals and formatted data for immediate use.
 */
async function loadOrderWithDetails(orderId: string) {
  // Load order and all related items with product data in a single query
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, slug, swatches, price))")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) return null;

  // Calculate totals and format data for immediate use
  const items = order.order_items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price as number) * item.quantity, 0);
  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    ...order,
    items,
    calculated: {
      subtotal,
      tax,
      total,
      taxRate,
    },
    // Add some unique processing - format dates and normalize data
    formatted: {
      createdAt: new Date(order.created_at).toLocaleDateString(),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    },
  };
}

// POST /api/orders
ordersRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid order payload", details: parsed.error.flatten() });
    }
    const { items, shipping, paymentMethod } = parsed.data;

    // Never trust client-supplied prices — look products up server-side.
    const productIds = [...new Set(items.map((i) => i.productId))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (productsError) throw productsError;

    const priceById = new Map(products.map((p) => [p.id, p.price as number]));
    const missing = productIds.filter((id) => !priceById.has(id));
    if (missing.length > 0) {
      return res.status(400).json({ error: "Unknown product id(s)", productIds: missing });
    }

    const subtotal = items.reduce((sum, item) => sum + priceById.get(item.productId)! * item.quantity, 0);
    const orderId = generateOrderId();

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      full_name: shipping.fullName,
      phone: shipping.phone,
      email: shipping.email ?? null,
      address: shipping.address,
      city: shipping.city,
      state: shipping.state,
      note: shipping.note ?? null,
      payment_method: paymentMethod,
      subtotal,
    });
    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        swatch: item.swatch,
        quantity: item.quantity,
        unit_price: priceById.get(item.productId)!,
      }))
    );
    if (itemsError) throw itemsError;

    res.status(201).json({ id: orderId, subtotal, paymentMethod, shipping });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
ordersRouter.get("/:id", async (req, res, next) => {
  try {
    const order = await loadOrderWithDetails(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    next(err);
  }
});