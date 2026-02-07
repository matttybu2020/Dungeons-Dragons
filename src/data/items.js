export const ITEM_RARITIES = {
    common: { color: '#9ca3af', glow: 'rgba(156, 163, 175, 0.3)', name: 'Común' },
    uncommon: { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)', name: 'Poco Común' },
    rare: { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)', name: 'Raro' },
    epic: { color: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)', name: 'Épico' },
    legendary: { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', name: 'Legendario' }
};

export const WEAPONS = [
    {
        id: 'rusty_sword',
        name: 'Espada Oxidada',
        type: 'weapon',
        rarity: 'common',
        damage: 5,
        icon: '🗡️',
        price: 50,
        description: 'Una espada vieja pero funcional'
    },
    {
        id: 'steel_sword',
        name: 'Espada de Acero',
        type: 'weapon',
        rarity: 'uncommon',
        damage: 12,
        icon: '⚔️',
        price: 200,
        description: 'Forjada con acero de calidad'
    },
    {
        id: 'flame_blade',
        name: 'Hoja Flamígera',
        type: 'weapon',
        rarity: 'rare',
        damage: 20,
        bonusFire: 5,
        icon: '🔥',
        price: 800,
        description: 'Arde con fuego eterno'
    },
    {
        id: 'dragon_slayer',
        name: 'Matadragones',
        type: 'weapon',
        rarity: 'epic',
        damage: 35,
        bonusDragon: 20,
        icon: '🐉',
        price: 3000,
        description: 'Forjada con escamas de dragón'
    },
    {
        id: 'excalibur',
        name: 'Excalibur',
        type: 'weapon',
        rarity: 'legendary',
        damage: 50,
        bonusAll: 10,
        icon: '✨',
        price: 10000,
        description: 'La espada legendaria de los reyes'
    }
];

export const ARMORS = [
    {
        id: 'leather_armor',
        name: 'Armadura de Cuero',
        type: 'armor',
        rarity: 'common',
        defense: 3,
        icon: '🧥',
        price: 40,
        description: 'Protección básica'
    },
    {
        id: 'chainmail',
        name: 'Cota de Malla',
        type: 'armor',
        rarity: 'uncommon',
        defense: 8,
        icon: '🛡️',
        price: 180,
        description: 'Anillos entrelazados de acero'
    },
    {
        id: 'plate_armor',
        name: 'Armadura de Placas',
        type: 'armor',
        rarity: 'rare',
        defense: 15,
        icon: '🛡️',
        price: 700,
        description: 'Armadura pesada de placas'
    },
    {
        id: 'dragon_scale',
        name: 'Escamas de Dragón',
        type: 'armor',
        rarity: 'epic',
        defense: 25,
        fireResist: 50,
        icon: '🐲',
        price: 2500,
        description: 'Escamas impenetrables de dragón'
    },
    {
        id: 'celestial_armor',
        name: 'Armadura Celestial',
        type: 'armor',
        rarity: 'legendary',
        defense: 40,
        hpRegen: 5,
        icon: '✨',
        price: 8000,
        description: 'Bendecida por los dioses'
    }
];

export const ACCESSORIES = [
    {
        id: 'health_ring',
        name: 'Anillo de Vitalidad',
        type: 'accessory',
        rarity: 'uncommon',
        bonusHp: 20,
        icon: '💍',
        price: 150,
        description: 'Aumenta tu vitalidad'
    },
    {
        id: 'mana_amulet',
        name: 'Amuleto de Mana',
        type: 'accessory',
        rarity: 'rare',
        bonusMana: 30,
        icon: '📿',
        price: 600,
        description: 'Incrementa tu reserva de mana'
    },
    {
        id: 'critical_ring',
        name: 'Anillo del Crítico',
        type: 'accessory',
        rarity: 'epic',
        critChance: 15,
        icon: '💎',
        price: 2000,
        description: '+15% probabilidad de crítico'
    },
    {
        id: 'phoenix_feather',
        name: 'Pluma de Fénix',
        type: 'accessory',
        rarity: 'legendary',
        revive: true,
        icon: '🔥',
        price: 15000,
        description: 'Revive automáticamente una vez'
    }
];

export const CONSUMABLES = [
    {
        id: 'health_potion',
        name: 'Poción de Vida',
        type: 'consumable',
        rarity: 'common',
        healAmount: 30,
        icon: '🧪',
        price: 25,
        description: 'Restaura 30 HP'
    },
    {
        id: 'mana_potion',
        name: 'Poción de Mana',
        type: 'consumable',
        rarity: 'common',
        manaAmount: 25,
        icon: '💙',
        price: 20,
        description: 'Restaura 25 Mana'
    },
    {
        id: 'elixir',
        name: 'Elixir Supremo',
        type: 'consumable',
        rarity: 'rare',
        healAmount: 100,
        manaAmount: 50,
        icon: '✨',
        price: 150,
        description: 'Restaura HP y Mana completamente'
    }
];

export const ALL_ITEMS = [...WEAPONS, ...ARMORS, ...ACCESSORIES, ...CONSUMABLES];

export const generateLoot = (enemyLevel = 1) => {
    const roll = Math.random();
    let rarity;

    if (roll < 0.5) rarity = 'common';
    else if (roll < 0.8) rarity = 'uncommon';
    else if (roll < 0.95) rarity = 'rare';
    else if (roll < 0.99) rarity = 'epic';
    else rarity = 'legendary';

    const itemsOfRarity = ALL_ITEMS.filter(item => item.rarity === rarity);
    return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
};
