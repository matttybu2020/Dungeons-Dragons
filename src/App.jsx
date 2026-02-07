import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Swords, Heart, Zap, Search, User,
  Map as MapIcon, Scroll, Flame, Sparkles,
  Skull, Trophy, Coins, Settings, ArrowRight,
  Save, GitBranch, Menu, X, Volume2, Package, ShoppingBag, Hammer,
  Users, MessageSquare, ListTodo
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';
import './components/Components.css';
import DragonBoss from './components/DragonBoss';
import ProceduralMap from './components/ProceduralMap';
import SpellBook from './components/SpellBook';
import SkillTree from './components/SkillTree';
import ItemShop from './components/ItemShop';
import InventoryPanel from './components/InventoryPanel';
import CraftingPanel from './components/CraftingPanel';
import QuestLog from './components/QuestLog';
import SocialSidebar from './components/SocialSidebar';
import NarrativeModal from './components/NarrativeModal';
import AchievementPanel from './components/AchievementPanel';
import { useGameStore } from './store/gameStore';
import { audioManager } from './utils/AudioManager';
import { ALL_ITEMS } from './data/items';

// --- CONFIGURACIÓN Y MOCKS ---
const CLASSES = [
  { id: 'warrior', name: 'Guerrero', icon: <Swords />, color: '#ef4444', desc: 'Maestro de las armas y la defensa.' },
  { id: 'mage', name: 'Mago', icon: <Flame />, color: '#3b82f6', desc: 'Manipulador de las artes arcanas.' },
  { id: 'paladin', name: 'Paladín', icon: <Shield />, color: '#fbbf24', desc: 'Defensor sagrado bendecido por la luz.' },
  { id: 'rogue', name: 'Pícaro', icon: <Zap />, color: '#10b981', desc: 'Experto en sigilo y ataques críticos.' }
];

// --- COMPONENTES ---

const CharacterCreation = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
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

const App = () => {
  const {
    character, setCharacter, updateCharacter, addXP, addGold,
    unlockAchievement, incrementStat, currentSave, addItem, addMaterial
  } = useGameStore();

  const [gameState, setGameState] = useState('creation'); // creation, world, combat
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [enemies, setEnemies] = useState([
    { x: 3, y: 4, name: 'Orco', hp: 30 },
    { x: 7, y: 2, name: 'Esqueleto', hp: 20 },
    { x: 2, y: 6, name: 'Goblin', hp: 15 },
    { x: 5, y: 8, name: 'Trol', hp: 50 }
  ]);
  const [dragonPos] = useState({ x: 8, y: 8 });
  const [log, setLog] = useState([]);
  const [combatEnemy, setCombatEnemy] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);

  // UI States
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showSaves, setShowSaves] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showCrafting, setShowCrafting] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [narrativeEvent, setNarrativeEvent] = useState(null);
  const [combatParticles, setCombatParticles] = useState([]);
  const [isShaking, setIsShaking] = useState(false);

  const { checkQuests } = useGameStore();

  useEffect(() => {
    if (character.name) {
      setGameState('world');
      audioManager.playMusic('world');
    }
  }, []);

  const generateNarrativeEvent = (x, y) => {
    const events = [
      {
        title: "El Ermitaño Ciego",
        description: "Un anciano medita entre las sombras. 'Puedo sentir tu destino, viajero. ¿Buscas poder o sabiduría?'",
        type: "dialogue",
        choices: [
          { text: "Poder (Recibir 100 XP)", action: () => addXP(100) },
          { text: "Sabiduría (Recibir 1 SP)", action: () => updateCharacter({ skillPoints: character.skillPoints + 1 }) }
        ]
      },
      {
        title: "Cofre Antiguo",
        description: "Encuentras un cofre cubierto de musgo. Parece contener algo valioso.",
        type: "discovery",
        choices: [
          {
            text: "Abrir Cofre", action: () => {
              const item = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
              addItem(item);
              addLog(`¡Has encontrado ${item.name}!`, 'success');
            }
          },
          { text: "Ignorar", action: () => addLog("Decides no arriesgarte.") }
        ]
      }
    ];

    setNarrativeEvent(events[Math.floor(Math.random() * events.length)]);
  };

  const handleNarrativeChoice = (choice) => {
    choice.action();
    setNarrativeEvent(null);
    checkQuests();
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const spawnParticles = (type, x, y) => {
    const newParticles = Array(10).fill(0).map(() => ({
      id: Math.random(),
      x, y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      color: type === 'blood' ? '#ef4444' : '#fbbf24',
      life: 1
    }));
    setCombatParticles(prev => [...prev, ...newParticles]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCombatParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.1
      })).filter(p => p.life > 0));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const addLog = (text, type = 'info') => {
    setLog(prev => [{ id: Date.now(), text, type }, ...prev].slice(0, 50));
  };

  const handleCreation = (data) => {
    setCharacter({
      ...character,
      ...data,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      gold: 500,
      xp: 0,
      skillPoints: 1,
      inventory: ['Poción de Vida', 'Mapa Arrugado']
    });
    setGameState('world');
    addLog(`¡Bienvenido, ${data.name} el ${data.class.name}! Tu aventura comienza ahora.`);
  };

  const handleMove = (x, y) => {
    const dist = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
    if (dist > 1) return;

    setPlayerPos({ x, y });
    incrementStat('playTime', 1);
    audioManager.playSFX('click');

    // Rare random narrative event
    if (Math.random() < 0.1) {
      generateNarrativeEvent(x, y);
    }

    // Encounter
    const enemyFound = enemies.find(e => e.x === x && e.y === y);
    if (enemyFound) {
      setCombatEnemy({ ...enemyFound, maxHp: enemyFound.hp });
      setGameState('combat');
      audioManager.playMusic('combat');
      addLog(`¡Has sido emboscado por un ${enemyFound.name}!`, 'danger');
      return;
    }

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
      const dmg = rollDice(12) + 5 + (character.unlockedSkills.includes('tier1_str') ? 5 : 0);
      const newEnemyHp = Math.max(0, combatEnemy.hp - dmg);
      setCombatEnemy(prev => ({ ...prev, hp: newEnemyHp }));
      addLog(`¡Golpeas al ${combatEnemy.name} por ${dmg} de daño!`, 'success');
      incrementStat('damageDealt', dmg);
      spawnParticles('blood', 500, 300); // Visual hit
      triggerShake();

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
      let dmg = rollDice(8) + (combatEnemy.isDragon ? 10 : 2);
      if (character.unlockedSkills.includes('tier2_def')) {
        dmg = Math.floor(dmg * 0.9);
      }

      const newHp = Math.max(0, character.hp - dmg);
      updateCharacter({ hp: newHp });
      addLog(`El ${combatEnemy.name} contraataca causando ${dmg} de daño.`, 'danger');
      incrementStat('damageTaken', dmg);

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

    const xpGain = combatEnemy.isDragon ? 1000 : 50;
    const goldGain = combatEnemy.isDragon ? 5000 : 20;

    addXP(xpGain);
    addGold(goldGain);
    incrementStat('enemiesKilled');
    audioManager.playSFX('victory');
    audioManager.playMusic('world');

    // Material Rewards
    const mats = ['iron', 'wood', 'magic_dust'];
    const randomMat = mats[Math.floor(Math.random() * mats.length)];
    const amount = Math.floor(Math.random() * 3) + 1;
    addMaterial(randomMat, amount);
    addLog(`¡Has recolectado ${amount} de ${randomMat}!`, 'info');

    if (combatEnemy.isDragon) {
      incrementStat('dragonsDefeated');
      unlockAchievement('slayer_of_dragons');
      addMaterial('dragon_scale', 2);
    }

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`game-layout ${isShaking ? 'shake-screen' : ''}`}
          >
            <header className="premium-nav glass-card">
              <div className="nav-left">
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
              </div>

              <div className="nav-center">
                <div className="gold-box"><Coins size={18} /> {character.gold} GP</div>
                <div className="xp-box">
                  <span className="xp-label">XP</span>
                  <div className="xp-bar-bg">
                    <div className="xp-bar-fill" style={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="nav-right">
                <button onClick={() => setShowSkillTree(true)} className="nav-btn" title="Habilidades">
                  <GitBranch size={20} />
                  {character.skillPoints > 0 && <span className="notification-dot"></span>}
                </button>
                <button onClick={() => setShowInventory(true)} className="nav-btn" title="Inventario">
                  <Package size={20} />
                </button>
                <button onClick={() => setShowShop(true)} className="nav-btn" title="Tienda">
                  <ShoppingBag size={20} />
                </button>
                <button onClick={() => setShowCrafting(true)} className="nav-btn" title="Forja">
                  <Hammer size={20} />
                </button>
                <button onClick={() => setShowQuests(true)} className="nav-btn" title="Misiones">
                  <ListTodo size={20} />
                  {useGameStore.getState().activeQuests.length > 0 && <span className="notification-dot"></span>}
                </button>
                <button onClick={() => setShowSocial(true)} className="nav-btn" title="Social">
                  <Users size={20} />
                </button>
                <button onClick={() => setShowAchievements(true)} className="nav-btn" title="Logros">
                  <Trophy size={20} />
                </button>
                <button onClick={() => setShowSaves(true)} className="nav-btn" title="Guardar/Cargar">
                  <Save size={20} />
                </button>
                <button className="nav-btn"><Settings size={20} /></button>
              </div>
            </header>

            <main className="game-content">
              <aside className="left-panel">
                <ProceduralMap
                  playerPos={playerPos}
                  onCellClick={handleMove}
                  theme={{ id: 'dungeon', name: 'Mazmorra de Sombras', color: '#1e293b' }}
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
                    updateCharacter({ mana: character.mana - (spell.manaCost || spell.cost) });
                  }}
                  inCombat={false}
                />
              </aside>
            </main>

            {/* Sub-Menus */}
            <SkillTree isOpen={showSkillTree} onClose={() => setShowSkillTree(false)} />
            <SaveLoadMenu isOpen={showSaves} onClose={() => setShowSaves(false)} />
            <AchievementPanel isOpen={showAchievements} onClose={() => setShowAchievements(false)} />
            <InventoryPanel isOpen={showInventory} onClose={() => setShowInventory(false)} />
            <ItemShop isOpen={showShop} onClose={() => setShowShop(false)} />
            <CraftingPanel isOpen={showCrafting} onClose={() => setShowCrafting(false)} />
            <QuestLog isOpen={showQuests} onClose={() => setShowQuests(false)} />

            {/* Social / Multiplayer Sidebar Mock */}
            <AnimatePresence>
              {showSocial && (
                <SocialSidebar onClose={() => setShowSocial(false)} />
              )}
            </AnimatePresence>

            {/* Narrative Event Modal */}
            <AnimatePresence>
              {narrativeEvent && (
                <NarrativeModal
                  event={narrativeEvent}
                  onClose={() => setNarrativeEvent(null)}
                  onChoice={(choice) => handleNarrativeChoice(choice)}
                />
              )}
            </AnimatePresence>
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
                  updateCharacter({ hp: newHp });
                  addLog(`¡El dragón te quema con ${dmg} de daño!`, 'danger');
                }}
              />
            ) : (
              <div className="combat-stage">
                <div className="combatant player">
                  <motion.div
                    animate={{ x: lastRoll ? [0, 20, 0] : 0 }}
                    transition={{ duration: 0.2 }}
                    className="sprite"
                  >
                    🧙‍♂️
                  </motion.div>
                  <div className="name-plate glow-text">{character.name}</div>
                </div>
                <div className="vs fantasy-title">VS</div>
                <div className="combatant enemy">
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="sprite"
                  >
                    👹
                  </motion.div>
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

            {/* Combat Particles */}
            <div className="combat-particles-layer">
              {combatParticles.map(p => (
                <div
                  key={p.id}
                  className="particle"
                  style={{
                    position: 'absolute',
                    left: p.x,
                    top: p.y,
                    width: 6,
                    height: 6,
                    background: p.color,
                    borderRadius: '50%',
                    opacity: p.life,
                    pointerEvents: 'none'
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gameover-screen">
            <h1 className="fantasy-title glow-text" style={{ fontSize: '5rem', color: '#ef4444' }}>Has Caído</h1>
            <p>Tu leyenda termina aquí... por ahora.</p>
            <button className="premium-button" onClick={() => window.location.reload()}>Renacer</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

