import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, Play, Clock } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const SaveLoadMenu = ({ isOpen, onClose, onLoadComplete }) => {
    const { saves, currentSave, saveGame, loadGame, deleteSave } = useGameStore();

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Vacío';
        const date = new Date(timestamp);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleSave = (slotName) => {
        saveGame(slotName);
        alert(`¡Partida guardada en ${slotName}!`);
    };

    const handleLoad = (slotName) => {
        if (!saves[slotName]) {
            alert('Este slot está vacío');
            return;
        }

        if (confirm('¿Cargar esta partida? Se perderá el progreso no guardado.')) {
            loadGame(slotName);
            onLoadComplete?.();
            onClose();
        }
    };

    const handleDelete = (slotName) => {
        if (confirm('¿Estás seguro de eliminar esta partida?')) {
            deleteSave(slotName);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="save-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="save-panel glass-card"
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                >
                    <h2 className="fantasy-title">💾 Guardar / Cargar Partida</h2>

                    <div className="save-slots">
                        {['slot1', 'slot2', 'slot3'].map((slotName, index) => {
                            const saveData = saves[slotName];
                            const isEmpty = !saveData;
                            const isCurrent = currentSave === slotName;

                            return (
                                <motion.div
                                    key={slotName}
                                    className={`save-slot ${isEmpty ? 'empty' : ''} ${isCurrent ? 'current' : ''}`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="slot-header">
                                        <h3>Slot {index + 1}</h3>
                                        {isCurrent && <span className="current-badge">Actual</span>}
                                    </div>

                                    {isEmpty ? (
                                        <div className="empty-slot-content">
                                            <p>Slot vacío</p>
                                            <button
                                                onClick={() => handleSave(slotName)}
                                                className="premium-button"
                                            >
                                                <Save size={18} /> Guardar Aquí
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="save-slot-content">
                                            <div className="save-info">
                                                <div className="character-preview">
                                                    <span className="char-icon">🧙‍♂️</span>
                                                    <div>
                                                        <h4>{saveData.character.name}</h4>
                                                        <p>Nivel {saveData.character.level} {saveData.character.class.name}</p>
                                                    </div>
                                                </div>

                                                <div className="save-stats">
                                                    <div className="stat-row">
                                                        <Clock size={14} />
                                                        <span>{formatDate(saveData.timestamp)}</span>
                                                    </div>
                                                    <div className="stat-row">
                                                        <span>💰 {saveData.character.gold} Oro</span>
                                                    </div>
                                                    <div className="stat-row">
                                                        <span>⚔️ {saveData.stats.enemiesKilled} Enemigos</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="save-actions">
                                                <button
                                                    onClick={() => handleLoad(slotName)}
                                                    className="premium-button"
                                                >
                                                    <Play size={18} /> Cargar
                                                </button>
                                                <button
                                                    onClick={() => handleSave(slotName)}
                                                    className="premium-button"
                                                >
                                                    <Save size={18} /> Sobrescribir
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slotName)}
                                                    className="delete-btn"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <button onClick={onClose} className="close-panel-btn premium-button">
                        Cerrar
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SaveLoadMenu;
