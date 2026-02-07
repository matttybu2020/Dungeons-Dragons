export const QUEST_DATABASE = [
    {
        id: 'first_blood',
        title: 'Primera Sangre',
        description: 'Derrota a 3 enemigos en la mazmorra.',
        goal: { type: 'kill', target: 3 },
        reward: { xp: 100, gold: 50 },
        icon: '⚔️'
    },
    {
        id: 'gold_rush',
        title: 'Fiebre del Oro',
        description: 'Acumula un total de 1000 monedas de oro.',
        goal: { type: 'gold', target: 1000 },
        reward: { xp: 200, gold: 0, item: 'rare_ring' },
        icon: '💰'
    },
    {
        id: 'dragon_slayer_quest',
        title: 'Leyenda del Cazador',
        description: 'Derrota al mítico Dragón Dorado.',
        goal: { type: 'dragon', target: 1 },
        reward: { xp: 2000, gold: 5000, skillPoint: 2 },
        icon: '🐉'
    }
];
