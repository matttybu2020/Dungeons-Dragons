import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Shield, Zap, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';

const DragonBoss = ({ dragon, onAttack, onDefeat, onDamage }) => {
    const [phase, setPhase] = useState(1); // 1, 2, 3
    const [isBreathing, setIsBreathing] = useState(false);

    useEffect(() => {
        const hpPercent = (dragon.hp / dragon.maxHp) * 100;
        if (hpPercent < 66 && phase === 1) setPhase(2);
        if (hpPercent < 33 && phase === 2) setPhase(3);
    }, [dragon.hp]);

    const breathFire = () => {
        setIsBreathing(true);
        setTimeout(() => {
            onDamage(30 + phase * 10);
            setIsBreathing(false);
        }, 1500);
    };

    useEffect(() => {
        if (phase > 1) {
            const interval = setInterval(() => {
                if (Math.random() > 0.6) breathFire();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [phase]);

    return (
        <div className="dragon-boss-arena">
            <div className="phase-indicator">
                <span className="fantasy-title">FASE {phase}/3</span>
                {phase === 2 && <span className="phase-warning">⚠️ ¡El dragón se enfurece!</span>}
                {phase === 3 && <span className="phase-critical">💀 ¡MODO BERSERK!</span>}
            </div>

            <motion.div
                className={`dragon-sprite phase-${phase} ${isBreathing ? 'breathing' : ''}`}
                animate={{
                    scale: isBreathing ? [1, 1.2, 1] : 1,
                    rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                🐉
                {isBreathing && (
                    <motion.div
                        className="fire-breath"
                        initial={{ scale: 0, x: -50 }}
                        animate={{ scale: 3, x: -300 }}
                        transition={{ duration: 1.5 }}
                    >
                        🔥
                    </motion.div>
                )}
            </motion.div>

            <div className="dragon-hp-container">
                <div className="dragon-name fantasy-title">{dragon.name}</div>
                <div className="dragon-hp-bar-outer">
                    <motion.div
                        className="dragon-hp-bar-inner"
                        style={{ width: `${(dragon.hp / dragon.maxHp) * 100}%` }}
                        animate={{
                            boxShadow: phase === 3
                                ? ['0 0 20px #ef4444', '0 0 40px #ef4444', '0 0 20px #ef4444']
                                : '0 0 20px #fbbf24'
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </div>
                <span className="hp-text">{dragon.hp} / {dragon.maxHp}</span>
            </div>

            <div className="dragon-abilities">
                <div className="ability-icon"><Flame /> Aliento de Fuego</div>
                <div className="ability-icon"><Shield /> Escamas Doradas</div>
                <div className="ability-icon"><Zap /> Rugido Atronador</div>
            </div>
        </div>
    );
};

export default DragonBoss;
