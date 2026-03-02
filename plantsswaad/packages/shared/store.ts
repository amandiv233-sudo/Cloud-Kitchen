import { create } from 'zustand';
import { Database } from './database.types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface CartItem extends MenuItem {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: MenuItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
            return {
                items: state.items.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
    removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
    })),
    clearCart: () => set({ items: [] }),
    getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));
