import React, { useState } from 'react';
import { CustomAction } from '../types';

interface ActionManagerProps {
    actions: CustomAction[];
    onAddAction: (action: CustomAction) => void;
    onDeleteAction: (id: string) => void;
}

const DEFAULT_ACTIONS: CustomAction[] = [
    { id: 'feeding', name: 'האכלה', icon: '🍼', type: 'feeding' },
    { id: 'breastfeeding', name: 'הנקה', icon: '🤱', type: 'breastfeeding' },
    { id: 'pee', name: 'פיפי', icon: '💧', type: 'pee' },
    { id: 'poo', name: 'קקי', icon: '💩', type: 'poo' },
    { id: 'medicine', name: 'תרופה', icon: '💊', type: 'medicine' },
    { id: 'diaper', name: 'החלפת חיתול', icon: '🧷', type: 'diaper' },
    { id: 'shower', name: 'מקלחת', icon: '🚿', type: 'shower' },
];

export const ActionManager: React.FC<ActionManagerProps> = ({ actions, onAddAction, onDeleteAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newActionName, setNewActionName] = useState('');
    const [error, setError] = useState('');

    // Lowercase names for duplicate check
    const allActionNames = actions.map(a => a.name.trim().toLowerCase());

    // Filter out suggested actions that are already added
    const filteredSuggestions = DEFAULT_ACTIONS.filter(
        def => !allActionNames.includes(def.name.trim().toLowerCase())
    );

    const handleAddAction = () => {
        const name = newActionName.trim();
        if (!name) return;
        if (allActionNames.includes(name.toLowerCase())) {
            setError('שם פעולה זה כבר קיים');
            return;
        }
        onAddAction({
            id: Date.now().toString(),
            name,
            icon: '📝', // Default icon
            type: 'custom'
        });
        setNewActionName('');
        setIsModalOpen(false);
        setError('');
    };

    const handleSelectDefaultAction = (action: CustomAction) => {
        if (allActionNames.includes(action.name.trim().toLowerCase())) {
            setError('שם פעולה זה כבר קיים');
            return;
        }
        onAddAction({
            ...action,
            id: Date.now().toString(),
            type: 'custom'
        });
        setIsModalOpen(false);
        setError('');
    };

    return (
        <div className="action-manager">
            <h2>פעולות מותאמות אישית</h2>
            <div className="actions-list">
                {actions.map(action => (
                    <div key={action.id} className="action-item">
                        <span className="action-name">
                            {action.icon} {action.name}
                        </span>
                        <button 
                            className="delete-action-btn"
                            onClick={() => onDeleteAction(action.id)}
                            title="מחקו פעולה"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => { setIsModalOpen(true); setError(''); }}
                className="add-action-btn"
            >
                + הוסיפו פעולה חדשה
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button 
                            className="modal-close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>
                        <h3>הוסיפו פעולה חדשה</h3>
                        
                        <div className="default-actions">
                            <h4>פעולות מומלצות</h4>
                            <div className="default-actions-grid">
                                {filteredSuggestions.length === 0 ? (
                                    <span style={{ color: '#888', fontSize: '0.95em', gridColumn: '1/-1', textAlign: 'center' }}>הוספתם את כל הפעולות המומלצות</span>
                                ) : (
                                    filteredSuggestions.map(action => (
                                        <button
                                            key={action.id}
                                            className="default-action-btn"
                                            onClick={() => handleSelectDefaultAction(action)}
                                        >
                                            {action.icon} {action.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="divider">
                            <span>או צרו פעולה מותאמת אישית</span>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                value={newActionName}
                                onChange={(e) => { setNewActionName(e.target.value); setError(''); }}
                                placeholder="שם הפעולה"
                                className="action-name-input"
                                aria-label="שם הפעולה"
                            />
                        </div>
                        {error && <div style={{ color: '#e91e63', fontSize: '0.9em', textAlign: 'center', marginBottom: 8 }}>{error}</div>}
                        <div className="form-buttons">
                            <button onClick={handleAddAction} className="save-btn">שמרו</button>
                            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">בטלו</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 