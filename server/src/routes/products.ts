import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { mapProductRow } from "../lib/mappers.js";

export const productsRouter = Router();

// GET /api/products?category=hair
productsRouter.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (category === "hair" || category === "cosmetics") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data.map(mapProductRow));
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
productsRouter.get("/:slug", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", req.params.slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Product not found" });

    res.json(mapProductRow(data));
  } catch (err) {
    next(err);
  }
});