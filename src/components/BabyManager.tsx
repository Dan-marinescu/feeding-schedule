import React, { useState } from 'react';
import { Baby } from '../types';

interface BabyManagerProps {
    babies: Baby[];
    onAddBaby: (baby: Baby) => void;
    onDeleteBaby: (id: string) => void;
}

export const BabyManager: React.FC<BabyManagerProps> = ({ babies, onAddBaby, onDeleteBaby }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBabyName, setNewBabyName] = useState('');
    const [newBabyGender, setNewBabyGender] = useState<'male' | 'female'>('male');

    const handleAddBaby = () => {
        if (newBabyName.trim()) {
            onAddBaby({
                id: Date.now().toString(),
                name: newBabyName.trim(),
                gender: newBabyGender
            });
            setNewBabyName('');
            setIsModalOpen(false);
        }
    };

    return (
        <div className="baby-manager">
            <h2>תינוקות</h2>
            <div className="babies-list">
                {babies.map(baby => (
                    <div key={baby.id} className="baby-item">
                        <span className="baby-name">
                            {baby.name} {baby.gender === 'male' ? '👦' : '👧'}
                        </span>
                        <button 
                            className="delete-baby-btn"
                            onClick={() => onDeleteBaby(baby.id)}
                            title="מחקו תינוק"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="add-baby-btn"
            >
                + הוסיפו תינוק חדש
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
                        <h3>הוסיפו תינוק חדש</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                value={newBabyName}
                                onChange={(e) => setNewBabyName(e.target.value)}
                                placeholder="שם התינוק"
                                className="baby-name-input"
                                aria-label="שם התינוק"
                            />
                        </div>
                        <div className="form-group">
                            <div className="gender-select">
                                <label>
                                    <input
                                        type="radio"
                                        checked={newBabyGender === 'male'}
                                        onChange={() => setNewBabyGender('male')}
                                    />
                                    👦 בן
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        checked={newBabyGender === 'female'}
                                        onChange={() => setNewBabyGender('female')}
                                    />
                                    👧 בת
                                </label>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button onClick={handleAddBaby} className="save-btn">שמרו</button>
                            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">בטלו</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 