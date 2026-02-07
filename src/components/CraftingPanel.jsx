import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, X, Sparkles, ArrowRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { WEAPONS, ARMORS, ALL_ITEMS } from '../data/items';

const CRAFTING_RECIPES = [
    {
        id: 'steel_sword_craft',
        result: WEAPONS.find(w => w.id === 'steel_sword'),
        materials: { iron: 3, wood: 1 },
        desc: "Una espada confiable de acero."
    },
    {
        id: 'flame_blade_craft',
        result: WEAPONS.find(w => w.id === 'flame_blade'),
        materials: { iron: 5, magic_dust: 2 },
        desc: "Inbuida con esencia de fuego."
    },
    {
        id: 'dragon_scale_armor_craft',
        result: ARMORS.find(a => a.id === 'dragon_scale'),
        materials: { iron: 10, dragon_scale: 5 },
        desc: "La defensa máxima contra el fuego."
    }
];

const CraftingCard = ({ recipe, onCraft, canCraft }) => {
    return (
        <motion.div
            className={`crafting-card ${canCraft ? 'available' : 'locked'}`}
            whileHover={canCraft ? { scale: 1.02, y: -5 } : {}}
            onClick={() => canCraft && onCraft(recipe)}
        >
            <div className="recipe-result">
                <span className="result-icon">{recipe.result.icon}</span>
                <div className="result-info">
                    <h4>{recipe.result.name}</h4>
                    <p>{recipe.desc}</p>
                </div>
            </div>

            <div className="recipe-materials">
                {Object.entries(recipe.materials).map(([mat, amount]) => (
                    <div key={mat} className="mat-req">
                        <span>{mat === 'iron' ? '⛓️' : mat === 'wood' ? '🪵' : mat === 'magic_dust' ? '✨' : '🐲'}</span>
                        <span>{amount}</span>
                    </div>
                ))}
            </div>

            <button className="craft-btn premium-button" disabled={!canCraft}>
                {canCraft ? 'Forjar' : 'Sin Materiales'}
            </button>
        </motion.div>
    );
};

const CraftingPanel = ({ isOpen, onClose }) => {
    const { character, addItem, updateCharacter } = useGameStore();

    const handleCraft = (recipe) => {
        // Subtract materials
        const newMaterials = { ...character.materials };
        Object.entries(recipe.materials).forEach(([mat, amount]) => {
            newMaterials[mat] -= amount;
        });

        updateCharacter({ materials: newMaterials });
        addItem(recipe.result);

        // Effects
        confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.7 }
        });
    };

    const canCraft = (recipe) => {
        return Object.entries(recipe.materials).every(([mat, amount]) =>
            character.materials[mat] >= amount
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="crafting-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="crafting-panel glass-card"
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="crafting-header">
                        <h2 className="fantasy-title"><Hammer /> Herrería Legendaria</h2>
                        <button onClick={onClose} className="close-btn"><X /></button>
                    </div>

                    <div className="crafting-grid">
                        {CRAFTING_RECIPES.map(recipe => (
                            <CraftingCard
                                key={recipe.id}
                                recipe={recipe}
                                onCraft={handleCraft}
                                canCraft={canCraft(recipe)}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CraftingPanel;
