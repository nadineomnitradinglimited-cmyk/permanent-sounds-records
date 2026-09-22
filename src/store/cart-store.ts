import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  beatId: string;
  beatSlug: string;
  beatTitle: string;
  coverArtUrl: string;
  licenseOptionId: string;
  licenseName: string;
  priceCents: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (licenseOptionId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.some(
          (i) => i.licenseOptionId === item.licenseOptionId,
        );
        if (exists) return;
        set({ items: [...get().items, item] });
      },
      removeItem: (licenseOptionId) => {
        set({
          items: get().items.filter(
            (i) => i.licenseOptionId !== licenseOptionId,
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "psr-cart" },
  ),
);
