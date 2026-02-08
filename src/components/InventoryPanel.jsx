import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Swords, Sparkles, X, Package, Heart, Zap, Trash2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ITEM_RARITIES } from '../data/items';

const InventoryPanel = ({ isOpen, onClose }) => {
    const { character, equipItem, unequipItem, useItem } = useGameStore();

    const handleAction = (item) => {
        if (item.type === 'consumable') {
            useItem(item);
        } else if (item.type === 'weapon') {
            equipItem(item, 'weapon');
        } else if (item.type === 'armor') {
            equipItem(item, 'armor');
        } else if (item.type === 'accessory') {
            equipItem(item, 'accessory');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="inventory-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="inventory-panel glass-card"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="inventory-header">
                        <h2 className="fantasy-title"><Package /> Equipo e Inventario</h2>
                        <button onClick={onClose} className="close-btn"><X /></button>
                    </div>

                    <div className="equipment-layout">
                        <div className="char-visual">
                            <motion.div
                                className="char-sprite-large"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                {character.class?.avatar || '👤'}
                                <div className="aura-glow"></div>
                            </motion.div>

                            <div className="slot-grid">
                                <EquipmentSlot
                                    label="Arma"
                                    item={character.equipment.weapon}
                                    onUnequip={() => unequipItem('weapon')}
                                    icon={<Swords />}
                                />
                                <EquipmentSlot
                                    label="Armadura"
                                    item={character.equipment.armor}
                                    onUnequip={() => unequipItem('armor')}
                                    icon={<Shield />}
                                />
                                <EquipmentSlot
                                    label="Accesorio"
                                    item={character.equipment.accessory}
                                    onUnequip={() => unequipItem('accessory')}
                                    icon={<Sparkles />}
                                />
                            </div>
                        </div>

                        <div className="inventory-list-container">
                            <h3 className="section-title">Objetos ({character.inventory.length})</h3>
                            <div className="inventory-grid">
                                {character.inventory.map((item, index) => (
                                    <InventoryItem
                                        key={`${item.id}-${index}`}
                                        item={item}
                                        onClick={() => handleAction(item)}
                                    />
                                ))}
                                {character.inventory.length === 0 && (
                                    <p className="empty-msg">Tu inventario está vacío</p>
                                )}
                            </div>

                            <h3 className="section-title">Materiales</h3>
                            <div className="materials-row">
                                {Object.entries(character.materials).map(([mat, amount]) => (
                                    <div key={mat} className="material-badge">
                                        <span className="mat-icon">{mat === 'wood' ? '🪵' : mat === 'iron' ? '⛓️' : mat === 'magic_dust' ? '✨' : '🐲'}</span>
                                        <span className="mat-amount">{amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const EquipmentSlot = ({ label, item, onUnequip, icon }) => {
    const rarity = item ? (ITEM_RARITIES[item.rarity] || ITEM_RARITIES.common) : null;

    return (
        <div className={`equipment-slot ${item ? 'filled' : 'empty'}`} style={item ? { '--rarity-color': rarity.color } : {}}>
            <span className="slot-label">{label}</span>
            <div className="slot-content">
                {item ? (
                    <>
                        <span className="item-icon">{item.icon}</span>
                        <div className="slot-item-info">
                            <span className="item-name">{item.name}</span>
                        </div>
                        <button className="unequip-btn" onClick={onUnequip}><X size={14} /></button>
                    </>
                ) : (
                    <div className="empty-icon">{icon}</div>
                )}
            </div>
            {item && <div className="slot-glow"></div>}
        </div>
    );
};

const InventoryItem = ({ item, onClick }) => {
    const rarity = ITEM_RARITIES[item.rarity] || ITEM_RARITIES.common;

    return (
        <motion.div
            className="inventory-item-card"
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={onClick}
            style={{ '--rarity-color': rarity.color, '--rarity-glow': rarity.glow }}
        >
            <div className="item-icon-small">{item.icon}</div>
            <div className="item-info-mini">
                <span className="name">{item.name}</span>
                <span className="type">{item.type}</span>
            </div>
            <div className="rarity-line"></div>
        </motion.div>
    );
};

export default InventoryPanel;
