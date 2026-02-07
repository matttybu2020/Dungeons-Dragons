import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Skull, Gift } from 'lucide-react';

const NarrativeModal = ({ event, onClose, onChoice }) => {
    if (!event) return null;

    return (
        <motion.div
            className="narrative-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="narrative-content glass-card"
                initial={{ scale: 0.8, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 100 }}
            >
                <div className="narrative-icon">
                    {event.type === 'discovery' ? <Gift className="glow-discovery" /> : <MessageSquare className="glow-dialog" />}
                </div>

                <h2 className="fantasy-title">{event.title}</h2>
                <p className="narrative-text">{event.description}</p>

                <div className="narrative-choices">
                    {event.choices.map((choice, index) => (
                        <button
                            key={index}
                            className="premium-button choice-btn"
                            onClick={() => {
                                onChoice(choice);
                                onClose();
                            }}
                        >
                            {choice.text}
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NarrativeModal;
