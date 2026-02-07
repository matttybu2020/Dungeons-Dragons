import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Shield, Zap, Flame, Heart, Crown, Lock } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const SKILLS = [
    {
        id: 'tier1_str',
        name: 'Fuerza de Titán',
        desc: '+5 Daño físico permanente',
        icon: <Shield />,
        cost: 1,
        requires: [],
        pos: { col: 0, row: 0 }
    },
    {
        id: 'tier1_int',
        name: 'Mente Arcana',
        desc: '+10 Mana máximo',
        icon: <Zap />,
        cost: 1,
        requires: [],
        pos: { col: 0, row: 1 }
    },
    {
        id: 'tier2_fire',
        name: 'Maestro del Fuego',
        desc: 'Hechizos de fuego +20% daño',
        icon: <Flame />,
        cost: 2,
        requires: ['tier1_int'],
        pos: { col: 1, row: 1 }
    },
    {
        id: 'tier2_def',
        name: 'Piel de Piedra',
        desc: '+10% Reducción de daño',
        icon: <Shield />,
        cost: 2,
        requires: ['tier1_str'],
        pos: { col: 1, row: 0 }
    },
    {
        id: 'tier3_god',
        name: 'Bendición Divina',
        desc: '+50 Vida y Mana, +10 Daño',
        icon: <Crown />,
        cost: 5,
        requires: ['tier2_fire', 'tier2_def'],
        pos: { col: 2, row: 0.5 }
    }
];

const SkillTree = ({ isOpen, onClose }) => {
    const { character, unlockSkill } = useGameStore();
    const unlocked = character.unlockedSkills || [];

    const isAvailable = (skill) => {
        if (unlocked.includes(skill.id)) return false;
        if (skill.requires.length === 0) return true;
        return skill.requires.every(reqId => unlocked.includes(reqId));
    };

    const handleUnlock = (skill) => {
        if (isAvailable(skill) && character.skillPoints >= skill.cost) {
            unlockSkill(skill.id, skill.cost);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="skill-tree-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="skill-tree-panel glass-card"
                    initial={{ scale: 0.9, rotateX: 20 }}
                    animate={{ scale: 1, rotateX: 0 }}
                >
                    <header className="skill-tree-header">
                        <div>
                            <h2 className="fantasy-title glow-text">Árbol de Habilidades</h2>
                            <p>Desbloquea tu verdadero potencial</p>
                        </div>
                        <div className="skill-points-badge">
                            ✨ {character.skillPoints} Puntos Disponibles
                        </div>
                    </header>

                    <div className="skill-grid">
                        {[0, 1, 2].map(col => (
                            <div key={col} className="skill-column">
                                {SKILLS.filter(s => s.pos.col === col).map(skill => {
                                    const isUnlocked = unlocked.includes(skill.id);
                                    const available = isAvailable(skill);
                                    const canAfford = character.skillPoints >= skill.cost;

                                    return (
                                        <motion.div
                                            key={skill.id}
                                            className={`skill-node ${isUnlocked ? 'unlocked' : ''} ${!isUnlocked && !available ? 'locked' : ''} ${available && canAfford ? 'available' : ''}`}
                                            whileHover={available ? { scale: 1.1 } : {}}
                                            onClick={() => handleUnlock(skill)}
                                        >
                                            {isUnlocked ? skill.icon : (available ? skill.icon : <Lock size={24} />)}

                                            <div className="skill-tooltip">
                                                <h4>{skill.name}</h4>
                                                <p>{skill.desc}</p>
                                                <p className="cost">Costo: {skill.cost} SP</p>
                                                {!available && !isUnlocked && (
                                                    <p className="req">Requiere: {skill.requires.map(r => SKILLS.find(s => s.id === r).name).join(', ')}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <button className="premium-button close-skill-btn" onClick={onClose}>
                        Cerrar
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SkillTree;
