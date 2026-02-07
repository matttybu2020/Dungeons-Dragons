import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_CHARACTER = {
    name: '',
    class: null,
    level: 1,
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    xp: 0,
    xpToNextLevel: 100,
    gold: 500,
    skillPoints: 0,
    inventory: [],
    equipment: {
        weapon: null,
        armor: null,
        accessory: null
    },
    skills: [],
    unlockedSkills: [],
    materials: {
        wood: 0,
        iron: 0,
        magic_dust: 0,
        dragon_scale: 0
    },
    stats: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
    }
};

export const useGameStore = create(
    persist(
        (set, get) => ({
            // Character State
            character: INITIAL_CHARACTER,

            // Game State
            currentSave: 'slot1',
            saves: {
                slot1: null,
                slot2: null,
                slot3: null
            },

            // Achievements
            achievements: [],
            unlockedAchievements: [],

            // Quests
            activeQuests: [],
            completedQuests: [],

            // Statistics
            stats: {
                enemiesKilled: 0,
                dragonsDefeated: 0,
                damageDealt: 0,
                damageTaken: 0,
                spellsCast: 0,
                itemsCollected: 0,
                goldEarned: 0,
                playTime: 0
            },

            // Settings
            settings: {
                musicVolume: 0.5,
                sfxVolume: 0.7,
                darkMode: true,
                particles: true
            },

            // Actions
            setCharacter: (character) => set({ character }),

            updateCharacter: (updates) => set((state) => ({
                character: { ...state.character, ...updates }
            })),

            addXP: (amount) => set((state) => {
                const newXP = state.character.xp + amount;
                const xpNeeded = state.character.xpToNextLevel;

                if (newXP >= xpNeeded) {
                    // Level up!
                    const newLevel = state.character.level + 1;
                    return {
                        character: {
                            ...state.character,
                            level: newLevel,
                            xp: newXP - xpNeeded,
                            xpToNextLevel: Math.floor(xpNeeded * 1.5),
                            maxHp: state.character.maxHp + 10,
                            maxMana: state.character.maxMana + 5,
                            hp: state.character.maxHp + 10,
                            mana: state.character.maxMana + 5,
                            skillPoints: state.character.skillPoints + 1
                        }
                    };
                }

                return {
                    character: { ...state.character, xp: newXP }
                };
            }),

            unlockSkill: (skillId, cost) => set((state) => {
                if (state.character.skillPoints < cost) return state;
                if (state.character.unlockedSkills.includes(skillId)) return state;

                return {
                    character: {
                        ...state.character,
                        skillPoints: state.character.skillPoints - cost,
                        unlockedSkills: [...state.character.unlockedSkills, skillId]
                    }
                };
            }),

            addGold: (amount) => set((state) => ({
                character: { ...state.character, gold: state.character.gold + amount },
                stats: { ...state.stats, goldEarned: state.stats.goldEarned + amount }
            })),

            addItem: (item) => set((state) => ({
                character: {
                    ...state.character,
                    inventory: [...state.character.inventory, item]
                },
                stats: { ...state.stats, itemsCollected: state.stats.itemsCollected + 1 }
            })),

            equipItem: (item, slot) => set((state) => {
                const oldItem = state.character.equipment[slot];
                let newInventory = state.character.inventory.filter(i => i.id !== item.id);
                if (oldItem) newInventory.push(oldItem);

                return {
                    character: {
                        ...state.character,
                        equipment: { ...state.character.equipment, [slot]: item },
                        inventory: newInventory
                    }
                };
            }),

            unequipItem: (slot) => set((state) => {
                const item = state.character.equipment[slot];
                if (!item) return state;

                return {
                    character: {
                        ...state.character,
                        equipment: { ...state.character.equipment, [slot]: null },
                        inventory: [...state.character.inventory, item]
                    }
                };
            }),

            useItem: (item) => set((state) => {
                if (item.type !== 'consumable') return state;

                let updates = {};
                if (item.healAmount) updates.hp = Math.min(state.character.maxHp, state.character.hp + item.healAmount);
                if (item.manaAmount) updates.mana = Math.min(state.character.maxMana, state.character.mana + item.manaAmount);

                return {
                    character: {
                        ...state.character,
                        ...updates,
                        inventory: state.character.inventory.filter(i => i.id !== item.id)
                    }
                };
            }),

            addMaterial: (material, amount) => set((state) => ({
                character: {
                    ...state.character,
                    materials: {
                        ...state.character.materials,
                        [material]: state.character.materials[material] + amount
                    }
                }
            })),

            // Save System
            saveGame: (slotName) => set((state) => {
                const saveData = {
                    character: state.character,
                    stats: state.stats,
                    achievements: state.unlockedAchievements,
                    quests: state.activeQuests,
                    timestamp: Date.now()
                };

                return {
                    saves: { ...state.saves, [slotName]: saveData },
                    currentSave: slotName
                };
            }),

            loadGame: (slotName) => set((state) => {
                const saveData = state.saves[slotName];
                if (!saveData) return state;

                return {
                    character: saveData.character,
                    stats: saveData.stats,
                    unlockedAchievements: saveData.achievements,
                    activeQuests: saveData.quests,
                    currentSave: slotName
                };
            }),

            deleteSave: (slotName) => set((state) => ({
                saves: { ...state.saves, [slotName]: null }
            })),

            // Achievements
            unlockAchievement: (achievementId) => set((state) => {
                if (state.unlockedAchievements.includes(achievementId)) return state;

                return {
                    unlockedAchievements: [...state.unlockedAchievements, achievementId]
                };
            }),

            // Quests
            addQuest: (quest) => set((state) => ({
                activeQuests: [...state.activeQuests, quest]
            })),

            completeQuest: (questId, reward) => set((state) => {
                const quest = state.activeQuests.find(q => q.id === questId);
                if (!quest) return state;

                // Grant rewards
                let charUpdates = { ...state.character };
                if (reward.xp) charUpdates.xp += reward.xp;
                if (reward.gold) charUpdates.gold += reward.gold;
                if (reward.skillPoint) charUpdates.skillPoints += reward.skillPoint;

                return {
                    character: charUpdates,
                    activeQuests: state.activeQuests.filter(q => q.id !== questId),
                    completedQuests: [...state.completedQuests, questId]
                };
            }),

            checkQuests: () => set((state) => {
                const { activeQuests, stats, character } = state;
                let questsToComplete = [];

                activeQuests.forEach(quest => {
                    let completed = false;
                    if (quest.goal.type === 'kill' && stats.enemiesKilled >= quest.goal.target) completed = true;
                    if (quest.goal.type === 'gold' && character.gold >= quest.goal.target) completed = true;
                    if (quest.goal.type === 'dragon' && stats.dragonsDefeated >= quest.goal.target) completed = true;

                    if (completed) questsToComplete.push(quest);
                });

                if (questsToComplete.length === 0) return state;

                // Recursively complete if multiple (simplified here to just first one for state safety)
                const q = questsToComplete[0];
                const newActive = activeQuests.filter(quest => quest.id !== q.id);
                const newCompleted = [...state.completedQuests, q.id];

                // Rewards
                let char = { ...state.character };
                if (q.reward.xp) char.xp += q.reward.xp;
                if (q.reward.gold) char.gold += q.reward.gold;
                if (q.reward.skillPoint) char.skillPoints += q.reward.skillPoint;

                return {
                    character: char,
                    activeQuests: newActive,
                    completedQuests: newCompleted
                };
            }),

            // Stats
            incrementStat: (statName, amount = 1) => set((state) => ({
                stats: { ...state.stats, [statName]: state.stats[statName] + amount }
            })),

            // Settings
            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),

            // Reset
            resetGame: () => set({
                character: INITIAL_CHARACTER,
                stats: {
                    enemiesKilled: 0,
                    dragonsDefeated: 0,
                    damageDealt: 0,
                    damageTaken: 0,
                    spellsCast: 0,
                    itemsCollected: 0,
                    goldEarned: 0,
                    playTime: 0
                }
            })
        }),
        {
            name: 'dnd-game-storage',
            partialize: (state) => ({
                saves: state.saves,
                unlockedAchievements: state.unlockedAchievements,
                completedQuests: state.completedQuests,
                settings: state.settings
            })
        }
    )
);
