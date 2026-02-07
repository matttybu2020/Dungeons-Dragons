import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ALL_ITEMS, ITEM_RARITIES } from '../data/items';

const ItemShop = ({ isOpen, onClose }) => {
    const { character, addItem, updateCharacter } = useGameStore();
    const [filter, setFilter] = React.useState('all');

    const buyItem = (item) => {
        if (character.gold < item.price) {
            return;
        }

        updateCharacter({ gold: character.gold - item.price });
        addItem(item);
    };

    const filteredItems = ALL_ITEMS.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    const getRarityColor = (rarity) => {
        return ITEM_RARITIES[rarity]?.color || '#94a3b8';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="shop-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="shop-panel glass-card"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="shop-header">
                            <h2 className="fantasy-title"><ShoppingBag size={24} /> Tienda del Mercader</h2>
                            <button onClick={onClose} className="close-btn"><X /></button>
                        </div>

                        <div className="shop-gold">
                            <Coins size={20} className="gold-icon" />
                            <span>Oro disponible: </span>
                            <span className="gold-amount">{character?.gold || 0} GP</span>
                        </div>

                        <div className="shop-filters">
                            {['all', 'weapon', 'armor', 'accessory', 'consumable'].map(f => (
                                <button
                                    key={f}
                                    className={filter === f ? 'active' : ''}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'all' ? 'Todos' : f === 'weapon' ? 'Armas' : f === 'armor' ? 'Armaduras' : f === 'accessory' ? 'Accesorios' : 'Pociones'}
                                </button>
                            ))}
                        </div>

                        <div className="shop-items-grid">
                            {filteredItems.map(item => {
                                const canAfford = (character?.gold || 0) >= item.price;
                                return (
                                    <div key={item.id} className={`shop-item-card glass-card ${!canAfford ? 'locked' : ''}`}>
                                        <div className="item-rarity-badge" style={{ background: getRarityColor(item.rarity) }}>
                                            {item.rarity}
                                        </div>
                                        <div className="item-icon-large">{item.icon}</div>
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-description">{item.description}</p>

                                        <div className="item-stats">
                                            {item.damage && <span className="stat">⚔️ +{item.damage} Daño</span>}
                                            {item.defense && <span className="stat">🛡️ +{item.defense} Defensa</span>}
                                            {item.bonusHp && <span className="stat">❤️ +{item.bonusHp} HP</span>}
                                            {item.healAmount && <span className="stat">🧪 +{item.healAmount} Cura</span>}
                                        </div>

                                        <div className="item-price-row">
                                            <span className="price">{item.price} GP</span>
                                            <button
                                                className="buy-btn premium-button"
                                                onClick={() => buyItem(item)}
                                                disabled={!canAfford}
                                            >
                                                {canAfford ? 'Comprar' : 'No puedes pagarlo'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ItemShop;
