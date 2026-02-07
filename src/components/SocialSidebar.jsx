import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Send, MessageSquare, Trophy, X, Globe, User } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const SocialSidebar = ({ onClose }) => {
    const { character } = useGameStore();
    const [tab, setTab] = useState('chat');
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([
        { id: 1, user: 'Aragorn99', text: '¿Alguien sabe cómo derrotar al Dragón?', time: '12:05' },
        { id: 2, user: 'MagoReluciente', text: 'Necesitas subir a nivel 10 al menos.', time: '12:06' },
        { id: 3, user: 'Slayer_2k', text: '¡Acabo de encontrar una espada épica!', time: '12:10' }
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const newMsg = {
            id: Date.now(),
            user: character?.name || 'Héroe',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatLog([...chatLog, newMsg]);
        setMessage('');
    };

    return (
        <motion.div
            className="social-sidebar glass-card"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            <div className="social-header">
                <div className="social-tabs">
                    <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>
                        <MessageSquare size={18} /> Chat
                    </button>
                    <button className={tab === 'leaderboard' ? 'active' : ''} onClick={() => setTab('leaderboard')}>
                        <Trophy size={18} /> Ranking
                    </button>
                </div>
                <button onClick={onClose} className="close-btn"><X /></button>
            </div>

            <div className="social-container">
                <AnimatePresence mode="wait">
                    {tab === 'chat' ? (
                        <motion.div
                            key="chat"
                            className="chat-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="chat-messages">
                                {chatLog.map(msg => (
                                    <div key={msg.id} className={`chat-msg ${msg.user === character?.name ? 'mine' : ''}`}>
                                        <span className="msg-user">{msg.user}</span>
                                        <span className="msg-text">{msg.text}</span>
                                        <span className="msg-time">{msg.time}</span>
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-row" onSubmit={handleSend}>
                                <input
                                    type="text"
                                    placeholder="Escribe algo..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button type="submit" className="send-btn"><Send size={18} /></button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="leaderboard"
                            className="leaderboard-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="leader-list">
                                {[
                                    { rank: 1, name: 'Xandhor', lvl: 99, class: 'Paladín' },
                                    { rank: 2, name: 'Illidan_Dark', lvl: 85, class: 'Brujo' },
                                    { rank: 3, name: 'LunaArcana', lvl: 72, class: 'Maga' },
                                    { rank: 4, name: character?.name || 'Tú', lvl: character?.level || 1, class: character?.class?.name || 'Viajero', isMe: true }
                                ].map(player => (
                                    <div key={player.rank} className={`leader-item ${player.isMe ? 'is-me' : ''}`}>
                                        <span className="rank">{player.rank}</span>
                                        <div className="leader-info">
                                            <span className="name">{player.name}</span>
                                            <span className="lvl">Nivel {player.lvl} {player.class}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="social-footer">
                <div className="online-count">
                    <Globe size={14} /> <span>124 Héroes Online</span>
                </div>
            </div>
        </motion.div>
    );
};

export default SocialSidebar;
