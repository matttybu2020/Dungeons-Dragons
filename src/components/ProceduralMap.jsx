import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DUNGEON_THEMES = [
    { id: 'crypt', name: 'Cripta Olvidada', color: '#1e293b', enemies: ['skeleton', 'ghost'] },
    { id: 'volcano', name: 'Volcán Ardiente', color: '#7c2d12', enemies: ['fire_elemental', 'demon'] },
    { id: 'forest', name: 'Bosque Maldito', color: '#14532d', enemies: ['wolf', 'treant'] },
    { id: 'castle', name: 'Castillo en Ruinas', color: '#312e81', enemies: ['knight', 'gargoyle'] }
];

const generateDungeon = (size = 10, theme) => {
    const grid = Array(size).fill(null).map(() => Array(size).fill('path'));

    // Generate walls (procedural)
    for (let i = 0; i < size * 2; i++) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (x !== 0 && y !== 0) grid[y][x] = 'wall';
    }

    // Place enemies
    const enemyCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < enemyCount; i++) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (grid[y][x] === 'path' && (x !== 0 || y !== 0)) {
            grid[y][x] = 'enemy';
        }
    }

    // Place treasure
    const treasureCount = 2;
    for (let i = 0; i < treasureCount; i++) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (grid[y][x] === 'path') grid[y][x] = 'treasure';
    }

    // Place dragon at far corner
    grid[size - 1][size - 1] = 'dragon';

    return grid;
};

const ProceduralMap = ({ onCellClick, playerPos, theme, character, dungeon: dungeonExternal, setDungeon: setDungeonExternal }) => {
    const [dungeonInternal, setDungeonInternal] = useState([]);
    const [discovered, setDiscovered] = useState(new Set());
    const [weather, setWeather] = useState([]);
    const [movingBlock, setMovingBlock] = useState({ x: 5, y: 5 });

    const currentDungeon = dungeonExternal || dungeonInternal;
    const setCurrentDungeon = setDungeonExternal || setDungeonInternal;

    useEffect(() => {
        if (!dungeonExternal || dungeonExternal.length === 0) {
            const newDungeon = generateDungeon(10, theme);
            setDungeonInternal(newDungeon);
        }
        setDiscovered(new Set(['0-0']));

        // Moving block logic
        const moveInterval = setInterval(() => {
            setMovingBlock(prev => {
                const dx = Math.floor(Math.random() * 3) - 1;
                const dy = Math.floor(Math.random() * 3) - 1;
                const newX = Math.max(0, Math.min(9, prev.x + dx));
                const newY = Math.max(0, Math.min(9, prev.y + dy));
                return { x: newX, y: newY };
            });
        }, 3000);

        // Generate ambient particles
        const particles = Array(20).fill(0).map(() => ({
            id: Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 3 + Math.random() * 5
        }));
        setWeather(particles);
        return () => clearInterval(moveInterval);
    }, [theme, dungeonExternal]);

    useEffect(() => {
        // Fog of war - reveal cells around player
        const newDiscovered = new Set(discovered);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const x = playerPos.x + dx;
                const y = playerPos.y + dy;
                if (x >= 0 && x < 10 && y >= 0 && y < 10) {
                    newDiscovered.add(`${x}-${y}`);
                }
            }
        }
        setDiscovered(newDiscovered);
    }, [playerPos]);

    const getCellEmoji = (cellType) => {
        switch (cellType) {
            case 'wall': return '🧱';
            case 'enemy': return '👹';
            case 'treasure': return '💎';
            case 'dragon': return '🐉';
            default: return '';
        }
    };

    return (
        <div className="procedural-map glass-card">

            <div className="weather-layer">
                {weather.map(p => (
                    <motion.div
                        key={p.id}
                        className="particle"
                        initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
                        animate={{
                            y: [`${p.y}%`, `${p.y - 10}%`, `${p.y}%`],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ repeat: Infinity, duration: p.duration }}
                        style={{
                            position: 'absolute',
                            width: p.size,
                            height: p.size,
                            background: theme.id === 'volcano' ? '#f97316' : '#fff',
                            borderRadius: '50%',
                            filter: 'blur(2px)',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                    />
                ))}
            </div>

            <div className="map-header">
                <span className="fantasy-title">{theme.name}</span>
                <button
                    className="regenerate-btn"
                    onClick={() => setCurrentDungeon(generateDungeon(10, theme))}
                >
                    🔄 Nueva Mazmorra
                </button>
            </div>
            <div className="dungeon-grid" style={{ '--theme-color': theme.color }}>

                {currentDungeon.map((row, y) =>
                    row.map((cell, x) => {
                        const isPlayer = playerPos.x === x && playerPos.y === y;
                        const isDiscovered = discovered.has(`${x}-${y}`);
                        const isMovingBlock = movingBlock.x === x && movingBlock.y === y;

                        return (
                            <motion.div
                                key={`${x}-${y}`}
                                className={`dungeon-cell ${cell} ${isPlayer ? 'player' : ''} ${!isDiscovered ? 'fog' : ''} ${isMovingBlock ? 'moving-block' : ''}`}
                                onClick={() => onCellClick(x, y)}
                                whileHover={{ scale: isDiscovered ? 1.1 : 1 }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: isDiscovered ? 1 : 0.3,
                                    boxShadow: isMovingBlock ? '0 0 15px #3b82f6' : 'none'
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                {isPlayer ? (
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        style={{ fontSize: '1.5rem', display: 'block' }}
                                    >
                                        {character?.class?.avatar || '👤'}
                                    </motion.span>
                                ) : isDiscovered ? (isMovingBlock ? '💎' : getCellEmoji(cell)) : '🌫️'}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProceduralMap;
