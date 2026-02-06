import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Snowflake, Zap, Heart, Shield } from 'lucide-react';

const SPELL_DATABASE = [
    {
        id: 'fireball',
        name: 'Bola de Fuego',
        icon: <Flame />,
        manaCost: 25,
        damage: 35,
        type: 'attack',
        element: 'fire',
        description: 'Una explosión devastadora de fuego puro',
        animation: '🔥💥',
        color: '#ef4444'
    },
    {
        id: 'ice_lance',
        name: 'Lanza de Hielo',
        icon: <Snowflake />,
        manaCost: 20,
        damage: 25,
        type: 'attack',
        element: 'ice',
        description: 'Congela y perfora al enemigo',
        animation: '❄️🔷',
        color: '#3b82f6'
    },
    {
        id: 'lightning',
        name: 'Relámpago',
        icon: <Zap />,
        manaCost: 30,
        damage: 40,
        type: 'attack',
        element: 'lightning',
        description: 'Invoca el poder de la tormenta',
        animation: '⚡💫',
        color: '#fbbf24'
    },
    {
        id: 'divine_heal',
        name: 'Curación Divina',
        icon: <Heart />,
        manaCost: 20,
        heal: 40,
        type: 'heal',
        element: 'holy',
        description: 'Restaura la vitalidad con luz sagrada',
        animation: '✨💚',
        color: '#22c55e'
    },
    {
        id: 'arcane_shield',
        name: 'Escudo Arcano',
        icon: <Shield />,
        manaCost: 15,
        defense: 10,
        type: 'buff',
        element: 'arcane',
        description: 'Crea una barrera mágica protectora',
        animation: '🛡️✨',
        color: '#a855f7'
    },
    {
        id: 'meteor',
        name: 'Lluvia de Meteoros',
        icon: <Sparkles />,
        manaCost: 50,
        damage: 70,
        type: 'ultimate',
        element: 'cosmic',
        description: 'ULTIMATE: Invoca meteoritos del cielo',
        animation: '☄️💥🌟',
        color: '#f97316'
    }
];

const SpellBook = ({ character, onCastSpell, inCombat }) => {
    const [selectedSpell, setSelectedSpell] = useState(null);
    const [filter, setFilter] = useState('all');

    const canCast = (spell) => {
        return character.mana >= spell.manaCost;
    };

    const filteredSpells = SPELL_DATABASE.filter(spell => {
        if (filter === 'all') return true;
        return spell.type === filter;
    });

    return (
        <div className="spellbook-container glass-card">
            <div className="spellbook-header">
                <h2 className="fantasy-title"><Sparkles size={20} /> Grimorio Arcano</h2>
                <div className="spell-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`filter-btn ${filter === 'attack' ? 'active' : ''}`}
                        onClick={() => setFilter('attack')}
                    >
                        Ataque
                    </button>
                    <button
                        className={`filter-btn ${filter === 'heal' ? 'active' : ''}`}
                        onClick={() => setFilter('heal')}
                    >
                        Curación
                    </button>
                    <button
                        className={`filter-btn ${filter === 'buff' ? 'active' : ''}`}
                        onClick={() => setFilter('buff')}
                    >
                        Mejoras
                    </button>
                </div>
            </div>

            <div className="spells-grid">
                <AnimatePresence>
                    {filteredSpells.map((spell, index) => (
                        <motion.div
                            key={spell.id}
                            className={`spell-card-advanced ${!canCast(spell) ? 'disabled' : ''} ${selectedSpell?.id === spell.id ? 'selected' : ''}`}
                            style={{ '--spell-color': spell.color }}
                            onClick={() => setSelectedSpell(spell)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: canCast(spell) ? 1.05 : 1 }}
                        >
                            <div className="spell-icon-container" style={{ color: spell.color }}>
                                {spell.icon}
                            </div>
                            <div className="spell-details">
                                <h3>{spell.name}</h3>
                                <p className="spell-desc">{spell.description}</p>
                                <div className="spell-stats">
                                    {spell.damage && <span className="stat-damage">⚔️ {spell.damage}</span>}
                                    {spell.heal && <span className="stat-heal">💚 {spell.heal}</span>}
                                    <span className="stat-mana">💧 {spell.manaCost}</span>
                                </div>
                            </div>
                            {spell.type === 'ultimate' && (
                                <div className="ultimate-badge">ULTIMATE</div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {selectedSpell && (
                <motion.div
                    className="spell-action-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="selected-spell-preview">
                        <span className="spell-animation">{selectedSpell.animation}</span>
                        <div>
                            <h3 className="fantasy-title">{selectedSpell.name}</h3>
                            <p>{selectedSpell.description}</p>
                        </div>
                    </div>
                    <button
                        className="cast-spell-btn premium-button"
                        disabled={!canCast(selectedSpell) || !inCombat}
                        onClick={() => onCastSpell(selectedSpell)}
                        style={{ background: canCast(selectedSpell) ? selectedSpell.color : '#374151' }}
                    >
                        {!inCombat ? '⚠️ Solo en Combate' : !canCast(selectedSpell) ? '❌ Mana Insuficiente' : `✨ Lanzar Hechizo`}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SpellBook;
