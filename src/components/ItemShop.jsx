import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ALL_ITEMS, ITEM_RARITIES } from '../data/items';

const ItemShop = ({ isOpen, onClose }) => {
    const { character, addItem, updateCharacter } = useGameStore();
    const [filter, setFilter] = React.useState('all');

    const buyItem = (item) => {
        if (character.gold < item.price) {
            alert('¡No tienes suficiente oro!');
            return;
        }

        updateCharacter({ gold: character.gold - item.price });
        addItem(item);

        // Visual feedback
        const btn = document.activeElement;
        btn.classList.add('purchase-success');
        setTimeout(() => btn.classList.remove('purchase-success'), 500);
    };

    const filteredItems = ALL_ITEMS.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    if (!isOpen) return null;

    return (
        <motion.div
            className="shop-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="shop-panel glass-card"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
            >
                <div className="shop-header">
                    <h2 className="fantasy-title"><ShoppingBag size={24} /> Tienda del Mercader</h2>
                    <button onClick={onClose} className="close-btn"><X /></button>
                </div>

                <div className="shop-gold">
                    Tu Oro: <span className="gold-amount">💰 {character.gold}</span>
                </div>

                <div className="shop-filters">
                    <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
                        Todos
                    </button>
                    <button onClick={() => setFilter('weapon')} className={filter === 'weapon' ? 'active' : ''}>
                        Armas
                    </button>
                    <button onClick={() => setFilter('armor')} className={filter === 'armor' ? 'active' : ''}>
                        Armaduras
                    </button>
                    <button onClick={() => setFilter('accessory')} className={filter === 'accessory' ? 'active' : ''}>
                        Accesorios
                    </button>
                    <button onClick={() => setFilter('consumable')} className={filter === 'consumable' ? 'active' : ''}>
                        Consumibles
                    </button>
                </div>

                <div className="shop-items-grid">
                    {filteredItems.map((item) => {
                        const rarity = ITEM_RARITIES[item.rarity];
                        const canAfford = character.gold >= item.price;

                        return (
                            <motion.div
                                key={item.id}
                                className={`shop-item-card ${!canAfford ? 'unaffordable' : ''}`}
                                style={{
                                    '--rarity-color': rarity.color,
                                    '--rarity-glow': rarity.glow
                                }}
                                whileHover={canAfford ? { scale: 1.05 } : {}}
                            >
                                <div className="item-rarity-badge" style={{ background: rarity.color }}>
                                    {rarity.name}
                                </div>

                                <div className="item-icon-large">{item.icon}</div>

                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-description">{item.description}</p>

                                <div className="item-stats">
                                    {item.damage && <span className="stat">⚔️ +{item.damage} Daño</span>}
                                    {item.defense && <span className="stat">🛡️ +{item.defense} Defensa</span>}
                                    {item.bonusHp && <span className="stat">❤️ +{item.bonusHp} HP</span>}
                                    {item.bonusMana && <span className="stat">💙 +{item.bonusMana} Mana</span>}
                                    {item.healAmount && <span className="stat">💚 Cura {item.healAmount}</span>}
                                </div>

                                <div className="item-price-row">
                                    <span className="price">💰 {item.price}</span>
                                    <button
                                        onClick={() => buyItem(item)}
                                        disabled={!canAfford}
                                        className="buy-btn premium-button"
                                    >
                                        {canAfford ? 'Comprar' : 'Sin Oro'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ItemShop;
