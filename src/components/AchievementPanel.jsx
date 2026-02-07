import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Gift } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import confetti from 'canvas-confetti';

const AchievementPanel = ({ isOpen, onClose }) => {
    const { unlockedAchievements, stats, addGold, addXP } = useGameStore();
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    const checkAndUnlock = (achievement) => {
        if (unlockedAchievements.includes(achievement.id)) return false;

        if (achievement.condition(stats)) {
            useGameStore.getState().unlockAchievement(achievement.id);

            // Give rewards
            if (achievement.reward.gold) addGold(achievement.reward.gold);
            if (achievement.reward.xp) addXP(achievement.reward.xp);

            // Celebration
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            return true;
        }
        return false;
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'legendary': return '#f59e0b';
            case 'epic': return '#a855f7';
            default: return '#3b82f6';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="achievement-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="achievement-panel glass-card"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                    >
                        <div className="panel-header">
                            <h2 className="fantasy-title"><Trophy size={24} /> Logros</h2>
                            <button onClick={onClose} className="close-btn"><X /></button>
                        </div>

                        <div className="achievements-grid">
                            {ACHIEVEMENTS.map((achievement) => {
                                const isUnlocked = unlockedAchievements.includes(achievement.id);
                                const canUnlock = !isUnlocked && achievement.condition(stats);

                                return (
                                    <motion.div
                                        key={achievement.id}
                                        className={`achievement-card ${isUnlocked ? 'unlocked' : ''} ${canUnlock ? 'ready' : ''}`}
                                        style={{ '--rarity-color': getRarityColor(achievement.rarity) }}
                                        onClick={() => {
                                            if (canUnlock) checkAndUnlock(achievement);
                                            setSelectedAchievement(achievement);
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className="achievement-icon">
                                            {isUnlocked ? achievement.icon : <Lock size={32} />}
                                        </div>
                                        <h3>{achievement.name}</h3>
                                        <p className="achievement-desc">{achievement.description}</p>

                                        {isUnlocked && (
                                            <div className="unlocked-badge">✓ Desbloqueado</div>
                                        )}

                                        {canUnlock && (
                                            <motion.div
                                                className="ready-badge"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            >
                                                <Gift size={16} /> ¡Listo!
                                            </motion.div>
                                        )}

                                        {achievement.reward && (
                                            <div className="reward-preview">
                                                {achievement.reward.gold && <span>💰 {achievement.reward.gold}</span>}
                                                {achievement.reward.xp && <span>⭐ {achievement.reward.xp} XP</span>}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="achievement-stats">
                            <div className="stat-item">
                                <span>Desbloqueados</span>
                                <strong>{unlockedAchievements.length} / {ACHIEVEMENTS.length}</strong>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementPanel;
