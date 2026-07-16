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
    email: z.string().email().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    note: z.string().optional(),
  }),
  paymentMethod: z.enum(["Pay on Delivery", "Bank Transfer"]),
});

function generateOrderId() {
  return `VR-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
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
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) return res.status(404).json({ error: "Order not found" });

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, products(name, slug, swatches)")
      .eq("order_id", req.params.id);

    if (itemsError) throw itemsError;

    res.json({ ...order, items });
  } catch (err) {
    next(err);
  }
});