export const ACHIEVEMENTS = [
    {
        id: 'first_blood',
        name: 'Primera Sangre',
        description: 'Derrota a tu primer enemigo',
        icon: '⚔️',
        condition: (stats) => stats.enemiesKilled >= 1,
        reward: { gold: 50, xp: 25 }
    },
    {
        id: 'orc_slayer',
        name: 'Cazador de Orcos',
        description: 'Derrota 10 enemigos',
        icon: '🗡️',
        condition: (stats) => stats.enemiesKilled >= 10,
        reward: { gold: 200, xp: 100 }
    },
    {
        id: 'dragon_slayer',
        name: 'Asesino de Dragones',
        description: 'Derrota al Dragón Dorado',
        icon: '🐉',
        rarity: 'legendary',
        condition: (stats) => stats.dragonsDefeated >= 1,
        reward: { gold: 5000, xp: 1000, item: 'dragon_scale' }
    },
    {
        id: 'spell_master',
        name: 'Maestro Arcano',
        description: 'Lanza 50 hechizos',
        icon: '🔮',
        condition: (stats) => stats.spellsCast >= 50,
        reward: { gold: 300, xp: 150 }
    },
    {
        id: 'treasure_hunter',
        name: 'Cazador de Tesoros',
        description: 'Colecciona 20 objetos',
        icon: '💎',
        condition: (stats) => stats.itemsCollected >= 20,
        reward: { gold: 500, xp: 200 }
    },
    {
        id: 'wealthy',
        name: 'Millonario',
        description: 'Acumula 10,000 de oro',
        icon: '💰',
        rarity: 'epic',
        condition: (stats) => stats.goldEarned >= 10000,
        reward: { xp: 500 }
    },
    {
        id: 'survivor',
        name: 'Superviviente',
        description: 'Sobrevive recibiendo más de 500 de daño',
        icon: '🛡️',
        condition: (stats) => stats.damageTaken >= 500,
        reward: { gold: 250, xp: 150 }
    },
    {
        id: 'berserker',
        name: 'Berserker',
        description: 'Inflige 1000 de daño total',
        icon: '💥',
        rarity: 'epic',
        condition: (stats) => stats.damageDealt >= 1000,
        reward: { gold: 400, xp: 300 }
    }
];

export const QUEST_TEMPLATES = [
    {
        type: 'kill',
        title: 'Caza de {enemy}',
        description: 'Elimina {count} {enemy} en la mazmorra',
        icon: '⚔️',
        rewards: { gold: 100, xp: 50 }
    },
    {
        type: 'collect',
        title: 'Búsqueda del Tesoro',
        description: 'Encuentra {count} tesoros escondidos',
        icon: '💎',
        rewards: { gold: 150, xp: 75 }
    },
    {
        type: 'explore',
        title: 'Explorador Intrépido',
        description: 'Explora {count} celdas del mapa',
        icon: '🗺️',
        rewards: { gold: 80, xp: 40 }
    },
    {
        type: 'survive',
        title: 'Prueba de Resistencia',
        description: 'Sobrevive {count} combates sin curarte',
        icon: '🛡️',
        rewards: { gold: 200, xp: 100 }
    }
];

export const generateQuest = () => {
    const template = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
    const count = Math.floor(Math.random() * 5) + 3;

    const enemies = ['Orcos', 'Esqueletos', 'Goblins', 'Zombis'];
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];

    return {
        id: `quest_${Date.now()}`,
        type: template.type,
        title: template.title.replace('{enemy}', enemy).replace('{count}', count),
        description: template.description.replace('{enemy}', enemy).replace('{count}', count),
        icon: template.icon,
        progress: 0,
        target: count,
        rewards: template.rewards,
        active: true
    };
};
