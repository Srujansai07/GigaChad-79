'use client';

import React, { useState } from 'react';
import { ShoppingBag, Loader2, Zap } from 'lucide-react';
import { ShopItem } from '@/types';
import { useShopStore } from '@/stores/shopStore';
import { useUserStore } from '@/stores/userStore';

interface ShopItemCardProps {
    item: ShopItem;
    ownedQuantity: number;
}

export default function ShopItemCard({ item, ownedQuantity }: ShopItemCardProps) {
    const { purchaseItem } = useShopStore();
    const { user, setUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);

    const canAfford = (user?.aura || 0) >= item.cost;

    const handlePurchase = async () => {
        if (!canAfford) return;

        setIsLoading(true);
        try {
            const newAura = await purchaseItem(item.id);
            // Update user aura locally
            if (user && newAura !== undefined) {
                setUser({ ...user, aura: newAura });
            }
        } catch (error) {
            console.error('Purchase failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-4 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center text-2xl">
                        {item.emoji || '🎁'}
                    </div>
                    {ownedQuantity > 0 && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold">
                            x{ownedQuantity} Owned
                        </span>
                    )}
                </div>

                <h3 className="font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{item.description}</p>
            </div>

            <button
                onClick={handlePurchase}
                disabled={isLoading || !canAfford}
                className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${canAfford
                        ? 'bg-surface-alt hover:bg-primary hover:text-white text-gray-300'
                        : 'bg-surface-alt/50 text-gray-600 cursor-not-allowed'
                    }`}
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                ) : (
                    <>
                        <Zap size={14} className={canAfford ? 'text-aura' : 'text-gray-600'} />
                        {item.cost}
                    </>
                )}
            </button>
        </div>
    );
}
