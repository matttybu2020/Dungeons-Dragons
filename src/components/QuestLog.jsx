import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, CheckCircle2, Circle, X, Trophy, Target } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { QUEST_DATABASE } from '../data/quests';

const QuestLog = ({ isOpen, onClose }) => {
    const { activeQuests, completedQuests, stats, character, addQuest } = useGameStore();

    const getProgress = (quest) => {
        if (quest.goal.type === 'kill') return Math.min(stats.enemiesKilled, quest.goal.target);
        if (quest.goal.type === 'gold') return Math.min(character.gold, quest.goal.target);
        if (quest.goal.type === 'dragon') return Math.min(stats.dragonsDefeated, quest.goal.target);
        return 0;
    };

    const isQuestActive = (id) => activeQuests.some(q => q.id === id);
    const isQuestCompleted = (id) => completedQuests.includes(id);

    const availableQuests = QUEST_DATABASE.filter(q => !isQuestActive(q.id) && !isQuestCompleted(q.id));

    return (
        <AnimatePresence>
            <motion.div
                className="quest-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="quest-panel glass-card"
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -200, opacity: 0 }}
                >
                    <div className="quest-header">
                        <h2 className="fantasy-title"><Scroll /> Diario de Misiones</h2>
                        <button onClick={onClose} className="close-btn"><X /></button>
                    </div>

                    <div className="quest-sections">
                        <section className="quest-section">
                            <h3 className="section-title"><Target size={18} /> Activas</h3>
                            <div className="quest-list">
                                {activeQuests.map(quest => {
                                    const progress = getProgress(quest);
                                    const percent = (progress / quest.goal.target) * 100;
                                    return (
                                        <div key={quest.id} className="quest-card active">
                                            <div className="quest-info">
                                                <span className="quest-icon">{quest.icon}</span>
                                                <div className="quest-text">
                                                    <h4>{quest.title}</h4>
                                                    <p>{quest.description}</p>
                                                </div>
                                            </div>
                                            <div className="quest-progress">
                                                <div className="progress-text">{progress} / {quest.goal.target}</div>
                                                <div className="progress-bar-bg">
                                                    <motion.div
                                                        className="progress-bar-fill"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {activeQuests.length === 0 && <p className="empty-msg">No tienes misiones activas</p>}
                            </div>
                        </section>

                        <section className="quest-section">
                            <h3 className="section-title"><Trophy size={18} /> Disponibles</h3>
                            <div className="quest-list">
                                {availableQuests.map(quest => (
                                    <div key={quest.id} className="quest-card available">
                                        <div className="quest-info">
                                            <span className="quest-icon">{quest.icon}</span>
                                            <div className="quest-text">
                                                <h4>{quest.title}</h4>
                                                <p>{quest.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="accept-quest-btn premium-button"
                                            onClick={() => addQuest(quest)}
                                        >
                                            Aceptar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuestLog;
