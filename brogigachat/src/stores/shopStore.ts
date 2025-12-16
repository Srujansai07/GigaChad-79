import { create } from 'zustand';
import { ShopItem, UserItem } from '@/types';

interface ShopState {
    items: ShopItem[];
    inventory: UserItem[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchShop: () => Promise<void>;
    purchaseItem: (itemId: string) => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
    items: [],
    inventory: [],
    isLoading: false,
    error: null,

    fetchShop: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/shop');
            if (!response.ok) throw new Error('Failed to fetch shop');

            const data = await response.json();
            set({ items: data.items, inventory: data.inventory });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    purchaseItem: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/shop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId }),
            });

            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || 'Failed to purchase item');
            }

            const { userItem, userAura } = await response.json();

            // Update inventory and potentially user aura (handled by userStore usually, but we can trigger a refresh if needed)
            // For now, we update local inventory state
            set((state) => {
                const existingItem = state.inventory.find(i => i.itemId === itemId);
                let newInventory;

                if (existingItem) {
                    newInventory = state.inventory.map(i =>
                        i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
                    );
                } else {
                    newInventory = [...state.inventory, userItem];
                }

                return { inventory: newInventory };
            });

            // Return aura for component to update user store if needed
            return userAura;

        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
