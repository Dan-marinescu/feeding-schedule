export interface Baby {
    id: string;
    name: string;
    gender: 'male' | 'female';
}

export type ActionType = 'feeding' | 'pee' | 'poo' | 'medicine' | 'diaper' | 'shower' | 'breastfeeding' | 'custom';

export interface CustomAction {
    id: string;
    name: string;
    icon: string;
    type: ActionType;
}

export interface ActivityRecord {
    id: string;
    babyId: string;
    actionType: ActionType;
    customActionId?: string;
    amount?: number; // For feeding
    notes?: string;
    timestamp: Date;
}

export interface FeedingAmount {
    value: number;
    label: string;
    icon: string;
} 