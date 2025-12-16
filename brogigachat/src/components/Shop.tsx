'use client';

import { useEffect } from 'react';
import { ShoppingBag, Loader2, Zap } from 'lucide-react';
import { useShopStore } from '@/stores/shopStore';
import { useUserStore } from '@/stores/userStore';
import ShopItemCard from '@/components/shop/ShopItemCard';
import BottomNav from '@/components/BottomNav';

export default function Shop() {
    const { items, inventory, isLoading, fetchShop } = useShopStore();
    const { user } = useUserStore();

    useEffect(() => {
        fetchShop();
    }, [fetchShop]);

    const getOwnedQuantity = (itemId: string) => {
        const item = inventory.find(i => i.itemId === itemId);
        return item ? item.quantity : 0;
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-white/5 p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="text-primary" />
                        The Shop
                    </h1>
                    <div className="flex items-center gap-1 bg-surface-alt px-3 py-1.5 rounded-full border border-white/5">
                        <Zap size={16} className="text-aura" />
                        <span className="font-bold text-white">{user?.aura.toLocaleString()}</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm">Spend your hard-earned Aura.</p>
            </div>

            <div className="p-4">
                {isLoading && items.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-white/5 rounded-xl bg-surface/50">
                        <p>The shop is currently empty.</p>
                        <p className="text-sm mt-2">Restocking soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item) => (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                ownedQuantity={getOwnedQuantity(item.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BottomNav currentScreen="shop" />
        </div>
    );
}
