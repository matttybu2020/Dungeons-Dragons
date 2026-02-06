import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Swords, Heart, Zap, Search, User,
  Map as MapIcon, Scroll, Flame, Sparkles,
  Skull, Trophy, Coins, Settings, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';
import './components/Components.css';
import DragonBoss from './components/DragonBoss';
import ProceduralMap from './components/ProceduralMap';
import SpellBook from './components/SpellBook';

// --- CONFIGURACIÓN Y MOCKS ---
const CLASSES = [
  { id: 'warrior', name: 'Guerrero', icon: <Swords />, color: '#ef4444', desc: 'Maestro de las armas y la defensa.' },
  { id: 'mage', name: 'Mago', icon: <Flame />, color: '#3b82f6', desc: 'Manipulador de las artes arcanas.' },
  { id: 'paladin', name: 'Paladín', icon: <Shield />, color: '#fbbf24', desc: 'Defensor sagrado bendecido por la luz.' },
  { id: 'rogue', name: 'Pícaro', icon: <Zap />, color: '#10b981', desc: 'Experto en sigilo y ataques críticos.' }
];

const SPELLS = [
  { id: 'fireball', name: 'Bola de Fuego', cost: 20, damage: 15, icon: '🔥', type: 'fire' },
  { id: 'heal', name: 'Luz Divina', cost: 15, heal: 12, icon: '✨', type: 'holy' },
  { id: 'arcane_bolt', name: 'Dardo Arcano', cost: 10, damage: 8, icon: '🔮', type: 'magic' }
];

const GRID_SIZE = 10;

// --- COMPONENTES ---

const CharacterCreation = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="creation-screen glass-card"
    >
      <h1 className="fantasy-title glow-text">Crea tu Leyenda</h1>
      <div className="creation-content">
        <div className="input-group">
          <label>Nombre del Héroe</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Valerius..."
            className="fantasy-input"
          />
        </div>

        <div className="class-grid">
          {CLASSES.map(cls => (
            <div
              key={cls.id}
              className={`class-card ${selectedClass.id === cls.id ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls)}
              style={{ '--cls-color': cls.color }}
            >
              <div className="class-icon">{cls.icon}</div>
              <h3>{cls.name}</h3>
              <p>{cls.desc}</p>
            </div>
          ))}
        </div>

        <button
          className="premium-button start-btn"
          disabled={!name}
          onClick={() => onComplete({ name, class: selectedClass })}
        >
          Iniciar Aventura <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const TacticalMap = ({ playerPos, enemies, onMove, dragonPos }) => {
  const [currentTheme] = useState({ id: 'crypt', name: 'Cripta Olvidada', color: '#1e293b' });

  return (
    <ProceduralMap
      playerPos={playerPos}
      onCellClick={onMove}
      theme={currentTheme}
    />
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('creation'); // creation, world, combat
  const [character, setCharacter] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [enemies, setEnemies] = useState([
    { x: 3, y: 4, name: 'Orco', hp: 30 },
    { x: 7, y: 2, name: 'Esqueleto', hp: 20 }
  ]);
  const [dragonPos, setDragonPos] = useState({ x: 8, y: 8 });
  const [log, setLog] = useState([]);
  const [combatEnemy, setCombatEnemy] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);

  const addLog = (text, type = 'info') => {
    setLog(prev => [{ id: Date.now(), text, type }, ...prev].slice(0, 50));
  };

  const handleCreation = (data) => {
    setCharacter({
      ...data,
      level: 1,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      gold: 500,
      xp: 0,
      inventory: ['Poción de Vida', 'Mapa Arrugado']
    });
    setGameState('world');
    addLog(`¡Bienvenido, ${data.name} el ${data.class.name}! Tu aventura comienza ahora.`);
  };

  const handleMove = (x, y) => {
    const dist = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
    if (dist > 1) return; // Solo mover 1 espacio

    setPlayerPos({ x, y });

    // Chequear encuentro con enemigo
    const enemyFound = enemies.find(e => e.x === x && e.y === y);
    if (enemyFound) {
      setCombatEnemy({ ...enemyFound, maxHp: enemyFound.hp });
      setGameState('combat');
      addLog(`¡Has sido emboscado por un ${enemyFound.name}!`, 'danger');
      return;
    }

    // Chequear encuentro con Dragón
    if (x === dragonPos.x && y === dragonPos.y) {
      setCombatEnemy({ name: 'DRAGÓN DORADO', hp: 200, maxHp: 200, isDragon: true });
      setGameState('combat');
      addLog(`¡TE ENCUENTRAS ANTE EL DRAGÓN DORADO! Prepárate para la batalla final.`, 'warning');
    }
  };

  const rollDice = (sides) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    setLastRoll({ sides, value: roll });
    return roll;
  };

  const handleAttack = () => {
    const roll = rollDice(20);
    addLog(`Tiras d20: ${roll}`, 'system');

    if (roll >= 10) {
      const dmg = rollDice(12) + 5;
      const newEnemyHp = Math.max(0, combatEnemy.hp - dmg);
      setCombatEnemy(prev => ({ ...prev, hp: newEnemyHp }));
      addLog(`¡Golpeas al ${combatEnemy.name} por ${dmg} de daño!`, 'success');

      if (newEnemyHp <= 0) {
        handleVictory();
      } else {
        enemyTurn();
      }
    } else {
      addLog(`¡Fallas el ataque!`, 'danger');
      enemyTurn();
    }
  };

  const enemyTurn = () => {
    setTimeout(() => {
      const dmg = rollDice(8) + (combatEnemy.isDragon ? 10 : 2);
      const newHp = Math.max(0, character.hp - dmg);
      setCharacter(prev => ({ ...prev, hp: newHp }));
      addLog(`El ${combatEnemy.name} contraataca causando ${dmg} de daño.`, 'danger');

      if (newHp <= 0) {
        setGameState('gameover');
      }
    }, 1000);
  };

  const handleVictory = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    addLog(`¡Has derrotado al ${combatEnemy.name}!`, 'success');
    setCharacter(prev => ({
      ...prev,
      xp: prev.xp + (combatEnemy.isDragon ? 1000 : 50),
      gold: prev.gold + (combatEnemy.isDragon ? 5000 : 20)
    }));
    setEnemies(prev => prev.filter(e => e.x !== playerPos.x || e.y !== playerPos.y));
    setGameState('world');
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {gameState === 'creation' && (
          <CharacterCreation onComplete={handleCreation} />
        )}

        {gameState === 'world' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-layout">
            <header className="premium-nav glass-card">
              <div className="user-stats">
                <div className="avatar">🧙‍♂️</div>
                <div>
                  <h2 className="fantasy-title">{character.name}</h2>
                  <span className="lvl-badge">LVL {character.level} {character.class.name}</span>
                </div>
              </div>
              <div className="resource-bars">
                <div className="bar-group">
                  <div className="bar-label">HP <Heart size={14} fill="#ef4444" /></div>
                  <div className="bar-bg"><div className="bar-fill hp" style={{ width: `${(character.hp / character.maxHp) * 100}%` }}></div></div>
                </div>
                <div className="bar-group">
                  <div className="bar-label">MANA <Zap size={14} fill="#3b82f6" /></div>
                  <div className="bar-bg"><div className="bar-fill mana" style={{ width: `${(character.mana / character.maxMana) * 100}%` }}></div></div>
                </div>
              </div>
              <div className="gold-box"><Coins size={18} /> {character.gold} GP</div>
            </header>

            <main className="game-content">
              <aside className="left-panel">
                <TacticalMap
                  playerPos={playerPos}
                  enemies={enemies}
                  dragonPos={dragonPos}
                  onMove={handleMove}
                />
              </aside>

              <section className="center-panel">
                <div className="log-panel glass-card">
                  <h3 className="fantasy-title"><Scroll size={18} /> Diario de Viaje</h3>
                  <div className="log-list">
                    {log.map(item => (
                      <div key={item.id} className={`log-item ${item.type}`}>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="right-panel">
                <SpellBook
                  character={character}
                  onCastSpell={(spell) => {
                    addLog(`Lanzas ${spell.name}!`, 'success');
                    setCharacter(prev => ({ ...prev, mana: prev.mana - spell.manaCost }));
                  }}
                  inCombat={false}
                />
              </aside>
            </main>
          </motion.div>
        )}

        {gameState === 'combat' && (
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="combat-screen"
          >
            {combatEnemy.isDragon ? (
              <DragonBoss
                dragon={combatEnemy}
                onAttack={handleAttack}
                onDefeat={handleVictory}
                onDamage={(dmg) => {
                  const newHp = Math.max(0, character.hp - dmg);
                  setCharacter(prev => ({ ...prev, hp: newHp }));
                  addLog(`¡El dragón te quema con ${dmg} de daño!`, 'danger');
                }}
              />
            ) : (
              <div className="combat-stage">
                <div className="combatant player">
                  <div className="sprite">🧙‍♂️</div>
                  <div className="name-plate">{character.name}</div>
                </div>
                <div className="vs fantasy-title">VS</div>
                <div className="combatant enemy">
                  <div className="sprite">👹</div>
                  <div className="name-plate">{combatEnemy.name}</div>
                  <div className="enemy-hp-bar">
                    <div className="fill" style={{ width: `${(combatEnemy.hp / combatEnemy.maxHp) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            <div className="combat-actions glass-card">
              <button onClick={handleAttack} className="premium-button attack-btn"><Swords /> ATACAR</button>
              <button className="premium-button spell-btn"><Zap /> HECHIZO</button>
              <button className="premium-button flee-btn" onClick={() => setGameState('world')}>HUIR</button>
            </div>

            {lastRoll && (
              <div className="roll-visualizer">
                <div className="dice-icon">🎲</div>
                <div className="dice-val">{lastRoll.value}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
