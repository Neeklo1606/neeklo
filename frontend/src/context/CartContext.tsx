import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartServiceItem {
  id: number;
  slug: string;
  title: string;
  short?: string;
  price_from: number;
  media_collections?: { cover?: Array<{ url: string }> };
}

interface CartContextValue {
  cart: CartServiceItem[];
  isCartOpen: boolean;
  isSuccessOpen: boolean;
  lastOrderId: string | null;
  lastOrderTotal: number | null;
  addToCart: (item: CartServiceItem) => void;
  removeFromCart: (id: number) => void;
  isInCart: (id: number) => boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  checkout: () => void;
  closeSuccess: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartServiceItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [lastOrderTotal, setLastOrderTotal] = useState<number | null>(null);

  const addToCart = useCallback((item: CartServiceItem) => {
    setCart((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInCart = useCallback(
    (id: number) => cart.some((i) => i.id === id),
    [cart]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((v) => !v), []);

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + (i.price_from ?? 0), 0),
    [cart]
  );

  const checkout = useCallback(() => {
    const orderId = "#NKO-" + Math.floor(1000 + Math.random() * 9000);
    setLastOrderId(orderId);
    setLastOrderTotal(total);
    setCart([]);
    setIsCartOpen(false);
    setIsSuccessOpen(true);
  }, [total]);

  const closeSuccess = useCallback(() => {
    setIsSuccessOpen(false);
    setLastOrderId(null);
    setLastOrderTotal(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isCartOpen,
      isSuccessOpen,
      lastOrderId,
      lastOrderTotal,
      addToCart,
      removeFromCart,
      isInCart,
      openCart,
      closeCart,
      toggleCart,
      checkout,
      closeSuccess,
      total,
    }),
    [
      cart,
      isCartOpen,
      isSuccessOpen,
      lastOrderId,
      lastOrderTotal,
      addToCart,
      removeFromCart,
      isInCart,
      openCart,
      closeCart,
      toggleCart,
      checkout,
      closeSuccess,
      total,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
