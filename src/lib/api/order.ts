import { api } from "./axios";

export interface CheckoutPayload {
  restaurants: {
    restaurantId: number;
    items: {
      menuId: number;
      quantity: number;
    }[];
  }[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod: string;
  notes?: string;
}

export async function checkoutOrder(data: CheckoutPayload, token: string) {
  const response = await api.post("/api/order/checkout", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export interface CheckoutRequest {
  restaurants: {
    restaurantId: number;
    items: {
      menuId: number;
      quantity: number;
    }[];
  }[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod: string;
  notes?: string;
}

export interface CheckoutResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export async function createOrder(
  data: CheckoutRequest,
  token: string,
): Promise<CheckoutResponse> {
  const response = await api.post<CheckoutResponse>(
    "/api/order/checkout",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.data.success === false) {
    throw new Error(response.data.message || "Checkout gagal.");
  }

  return response.data;
}


export type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "cancelled";

export interface MyOrderItem {
  menuId: number;
  menuName: string;
  price: number;
  image: string;
  quantity: number;
  itemTotal: number;
}

export interface MyOrderRestaurant {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: MyOrderItem[];
  subtotal: number;
}

export interface MyOrder {
  id: number;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: string;
  phone: string;
  pricing: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    totalPrice: number;
  };
  restaurants: MyOrderRestaurant[];
  createdAt: string;
  updatedAt: string;
}

export interface MyOrdersResponse {
  success: boolean;
  data: {
    orders: MyOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filter: {
      status: string;
    };
  };
}

export async function getMyOrders(
  token: string,
  status: OrderStatus = "done",
  page = 1,
  limit = 10,
): Promise<MyOrdersResponse> {
  const response = await api.get<MyOrdersResponse>("/api/order/my-order", {
    params: { status, page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
