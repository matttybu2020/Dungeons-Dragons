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

            equipItem: (item, slot) => set((state) => ({
                character: {
                    ...state.character,
                    equipment: { ...state.character.equipment, [slot]: item }
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

            completeQuest: (questId) => set((state) => ({
                activeQuests: state.activeQuests.filter(q => q.id !== questId),
                completedQuests: [...state.completedQuests, questId]
            })),

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
