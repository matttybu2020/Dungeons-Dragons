import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('exploration'); // exploration, combat, victory, gameover
  const [character, setCharacter] = useState({
    name: "Valerius the Brave",
    class: "Paladin",
    level: 5,
    hp: 42,
    maxHp: 55,
    ac: 18,
    stats: {
      str: 16, dex: 10, con: 14, int: 8, wis: 12, cha: 15
    },
    gold: 120,
    inventory: ["Espada de Acero", "Escudo", "Poción de Curación", "Linterna"]
  });

  const [enemy, setEnemy] = useState(null);

  const [log, setLog] = useState([
    { type: 'system', text: 'Bienvenido a la Mazmorra de las Sombras.' },
    { type: 'narrative', text: 'Te encuentras frente a una pesada puerta de piedra. El aire es frío y huele a humedad.' }
  ]);

  const [lastRoll, setLastRoll] = useState(null);
  const logEndRef = useRef(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
    // Re-run lucide icons if they exist
    if (window.lucide) window.lucide.createIcons();
  }, [log, gameState]);

  const addLog = (text, type = 'info') => {
    setLog(prev => [...prev, { type, text }]);
  }

  const rollDice = (sides) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    setLastRoll({ sides, value: roll });
    return roll;
  };

  const startCombat = () => {
    setEnemy({
      name: "Gran Orco de las Sombras",
      hp: 40,
      maxHp: 40,
      ac: 14,
      attackName: "Hachazo",
      damage: 8
    });
    setGameState('combat');
    addLog("¡Un Gran Orco surge de las sombras!", "danger");
  }

  const handleAttack = () => {
    if (!enemy) return;

    const attackRoll = rollDice(20);
    addLog(`Lanzas un ataque: (d20) ${attackRoll}`, 'info');

    if (attackRoll >= enemy.ac) {
      const damage = rollDice(8) + 3; // d8 + str mod
      const newEnemyHp = Math.max(0, enemy.hp - damage);
      setEnemy(prev => ({ ...prev, hp: newEnemyHp }));
      addLog(`¡Golpeas al ${enemy.name} por ${damage} de daño!`, 'success');

      if (newEnemyHp <= 0) {
        addLog(`¡Has derrotado al ${enemy.name}!`, 'success');
        setGameState('victory');
        setCharacter(prev => ({ ...prev, gold: prev.gold + 50 }));
      } else {
        enemyTurn();
      }
    } else {
      addLog(`¡Fallas el ataque!`, 'system');
      enemyTurn();
    }
  }

  const enemyTurn = () => {
    setTimeout(() => {
      const attackRoll = rollDice(20);
      addLog(`${enemy.name} ataca con ${enemy.attackName}: (d20) ${attackRoll}`, 'info');

      if (attackRoll >= character.ac) {
        const damage = Math.floor(Math.random() * enemy.damage) + 2;
        const newHp = Math.max(0, character.hp - damage);
        setCharacter(prev => ({ ...prev, hp: newHp }));
        addLog(`${enemy.name} te golpea por ${damage} de daño.`, 'danger');

        if (newHp <= 0) {
          setGameState('gameover');
          addLog("Has caído en combate...", "danger");
        }
      } else {
        addLog(`¡El ataque del ${enemy.name} rebota en tu armadura!`, 'info');
      }
    }, 1000);
  }

  const takeAction = (action) => {
    if (gameState === 'combat') {
      if (action === 'attack') handleAttack();
      if (action === 'heal') {
        const healAmt = rollDice(8) + 4;
        setCharacter(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmt) }));
        addLog(`Usas una poción y recuperas ${healAmt} HP`, 'success');
        enemyTurn();
      }
      return;
    }

    switch (action) {
      case 'investigate':
        addLog("Investigas el entorno cuidadosamente...", "narrative");
        const roll = rollDice(20);
        if (roll > 12) {
          addLog("¡Encuentras huellas frescas! Algo se acerca...", "info");
          setTimeout(startCombat, 1500);
        } else {
          addLog("No parece haber nada fuera de lo común.", "system");
        }
        break;
      case 'attack':
        addLog("¡Mueves tu arma al aire, listo para el combate!", "narrative");
        break;
      case 'heal':
        const healAmt = rollDice(8) + 4;
        setCharacter(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmt) }));
        addLog(`Usas una poción y recuperas ${healAmt} HP`, 'success');
        break;
      case 'reset':
        window.location.reload();
        break;
      default:
        break;
    }
  }

  return (
    <div className={`game-container state-${gameState}`}>
      {/* Top Header */}
      <header className="game-header glass-panel">
        <div className="char-profile">
          <div className="char-avatar"><i data-lucide="shield"></i></div>
          <div className="char-info">
            <h2 className="fantasy-font glow-text">{character.name}</h2>
            <p>Nivel {character.level} {character.class}</p>
          </div>
        </div>

        <div className="vitals">
          <div className="stat-box">
            <span>HP</span>
            <div className="hp-container">
              <div className="hp-bar">
                <div className="hp-fill" style={{ width: `${(character.hp / character.maxHp) * 100}%` }}></div>
              </div>
              <span className="hp-numbers">{character.hp}/{character.maxHp}</span>
            </div>
          </div>
          <div className="stat-box">
            <span className="ac-label">AC</span>
            <div className="ac-circle">{character.ac}</div>
          </div>
        </div>
      </header>

      <main className="game-main">
        {/* Left Side: Stats */}
        <aside className="side-panel glass-panel">
          <h3 className="fantasy-font section-title">Atributos</h3>
          <div className="stats-grid">
            {Object.entries(character.stats).map(([stat, val]) => (
              <div key={stat} className="stat-item">
                <span className="stat-label">{stat.toUpperCase()}</span>
                <span className="stat-value">{val}</span>
                <span className="stat-mod">+{Math.floor((val - 10) / 2)}</span>
              </div>
            ))}
          </div>

          <h3 className="fantasy-font section-title" style={{ marginTop: '2rem' }}>Inventario</h3>
          <ul className="inventory-list">
            {character.inventory.map((item, i) => (
              <li key={i} className="inventory-item">
                <i data-lucide="package" style={{ width: 14, height: 14, marginRight: 8 }}></i>
                {item}
              </li>
            ))}
          </ul>
          <div className="gold-display">
            <i data-lucide="coins" style={{ color: 'var(--accent)', marginRight: 8 }}></i>
            {character.gold} GP
          </div>
        </aside>

        {/* Center: Action & Log */}
        <section className="action-area">
          {gameState === 'combat' && enemy && (
            <div className="enemy-card glass-panel animate-slide-down">
              <div className="enemy-header">
                <h3 className="fantasy-font">{enemy.name}</h3>
                <div className="enemy-hp-bar">
                  <div className="enemy-hp-fill" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}></div>
                </div>
                <span className="enemy-hp-text">{enemy.hp} / {enemy.maxHp} HP</span>
              </div>
              <div className="enemy-visual">👹</div>
            </div>
          )}

          {gameState === 'victory' && (
            <div className="victory-overlay glass-panel animate-pop-in">
              <h1 className="fantasy-font glow-text">¡VICTORIA!</h1>
              <p>Has derrotado a tus enemigos y sobrevivido un día más.</p>
              <button onClick={() => setGameState('exploration')} className="action-btn primary-btn">Continuar Aventura</button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="gameover-overlay glass-panel animate-pop-in">
              <h1 className="fantasy-font" style={{ color: 'var(--danger)' }}>HAS MUERTO</h1>
              <p>Tu historia termina aquí...</p>
              <button onClick={() => takeAction('reset')} className="action-btn danger-btn">Reintentar</button>
            </div>
          )}

          <div className="log-container glass-panel">
            {log.map((entry, i) => (
              <div key={i} className={`log-entry ${entry.type}`}>
                {entry.text}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          <div className="dice-controls glass-panel">
            <button onClick={() => rollDice(20)} className="dice-btn d20">d20</button>
            <button onClick={() => rollDice(12)} className="dice-btn">d12</button>
            <button onClick={() => rollDice(10)} className="dice-btn">d10</button>
            <button onClick={() => rollDice(8)} className="dice-btn">d8</button>
            <button onClick={() => rollDice(6)} className="dice-btn">d6</button>
            <button onClick={() => rollDice(4)} className="dice-btn">d4</button>
          </div>
        </section>

        {/* Right Side: Quick Actions */}
        <aside className="side-panel glass-panel">
          <h3 className="fantasy-font section-title">Acciones</h3>
          <div className="action-buttons">
            {gameState === 'exploration' ? (
              <>
                <button onClick={() => takeAction('investigate')} className="action-btn">
                  <i data-lucide="search" style={{ marginRight: 8 }}></i> Investigar
                </button>
                <button onClick={() => takeAction('attack')} className="action-btn primary-btn">
                  <i data-lucide="swords" style={{ marginRight: 8 }}></i> Alistarse
                </button>
              </>
            ) : (
              <>
                <button onClick={() => takeAction('attack')} className="action-btn primary-btn pulse">
                  <i data-lucide="swords" style={{ marginRight: 8 }}></i> Atacar
                </button>
                <button onClick={() => takeAction('heal')} className="action-btn success-btn">
                  <i data-lucide="heart" style={{ marginRight: 8 }}></i> Poción
                </button>
              </>
            )}
          </div>

          {lastRoll && (
            <div className="roll-result-box">
              <span className="roll-label">Resultado d{lastRoll.sides}</span>
              <div className="roll-value">{lastRoll.value}</div>
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}

export default App
