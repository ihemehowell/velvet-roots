import { NextResponse } from "next/server";
import type { CartLine, Order, ShippingInfo } from "../../../lib/types";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: { productId: string; swatch: string; quantity: number }[];
      shipping?: ShippingInfo;
      paymentMethod?: Order["paymentMethod"];
    };

    const response = await fetch(`${BACKEND_API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Failed to create order on backend" }, { status: response.status });
    }

    const orderData = await response.json();
    return NextResponse.json(orderData, { status: 201 });
  } catch (error) {
    console.error("Frontend API - Order creation error:", error);
    return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.pathname.split('/').pop();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_API_URL}/api/orders/${orderId}`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Failed to fetch order from backend" }, { status: response.status });
    }

    const orderData = await response.json();
    return NextResponse.json(orderData);
  } catch (error) {
    console.error("Frontend API - Order fetch error:", error);
    return NextResponse.json({ error: "Unable to fetch order." }, { status: 500 });
  }
}
