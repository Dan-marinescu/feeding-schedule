import { useState, useEffect, useRef } from 'react';
import { Baby, ActivityRecord, CustomAction, FeedingAmount } from '../types';
import { BabyManager } from './BabyManager';
import { ActionManager } from './ActionManager';

const FEEDING_AMOUNTS: FeedingAmount[] = [
    { value: 60, label: '60 מ"ל', icon: '🍼' },
    { value: 120, label: '120 מ"ל', icon: '🍼🍼' },
    { value: 180, label: '180 מ"ל', icon: '🍼🍼🍼' },
];

const STORAGE_KEYS = {
    babies: 'feeding-babies-v1',
    actions: 'feeding-actions-v1',
    records: 'feeding-records-v1',
};

function getTimeAgoString(date: Date | null): string {
    if (!date) return 'אין פעילויות עדיין';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    if (diffMs < 60000) return 'הרגע';
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) {
        return `לפני ${hours} שעות ו-${mins} דקות`;
    } else {
        return `לפני ${mins} דקות`;
    }
}

function saveToStorage<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return defaultValue;
        return JSON.parse(raw);
    } catch {
        return defaultValue;
    }
}

export const FeedingTracker = () => {
    const [babies, setBabies] = useState<Baby[]>(loadFromStorage(STORAGE_KEYS.babies, []));
    const [customActions, setCustomActions] = useState<CustomAction[]>(loadFromStorage(STORAGE_KEYS.actions, []));
    const [records, setRecords] = useState<ActivityRecord[]>(() => {
        const loaded = loadFromStorage(STORAGE_KEYS.records, []);
        return loaded.map((rec: any) => ({ ...rec, timestamp: new Date(rec.timestamp) }));
    });
    
    const [selectedBaby, setSelectedBaby] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [selectedAmount, setSelectedAmount] = useState<number>(60);
    const [notes, setNotes] = useState('');
    const [errorPopup, setErrorPopup] = useState<string | null>(null);
    const errorPopupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.babies, babies);
        if (babies.length > 0 && !selectedBaby) {
            setSelectedBaby(babies[0].id);
        }
    }, [babies]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.actions, customActions);
    }, [customActions]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.records, records);
    }, [records]);

    // Focus trap and esc for error popup
    useEffect(() => {
        if (errorPopup && errorPopupRef.current) {
            const focusable = errorPopupRef.current.querySelector('button');
            if (focusable) (focusable as HTMLElement).focus();
            const handleKey = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setErrorPopup(null);
            };
            document.addEventListener('keydown', handleKey);
            return () => document.removeEventListener('keydown', handleKey);
        }
    }, [errorPopup]);

    const addRecord = () => {
        if (!selectedBaby || !selectedAction) {
            setErrorPopup('יש לבחור תינוק ופעולה לפני הוספת פעילות.');
            return;
        }

        const newRecord: ActivityRecord = {
            id: Date.now().toString(),
            babyId: selectedBaby,
            actionType: selectedAction === 'feeding' || selectedAction === 'breastfeeding' ? selectedAction : 'custom',
            customActionId: selectedAction !== 'feeding' && selectedAction !== 'breastfeeding' ? selectedAction : undefined,
            amount: selectedAction === 'feeding' ? selectedAmount : undefined,
            notes: notes.trim() || undefined,
            timestamp: new Date(),
        };

        setRecords(prev => [...prev, newRecord]);
        setNotes('');
    };

    const deleteRecord = (id: string) => {
        setRecords(prev => prev.filter(r => r.id !== id));
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Group records by baby
    const recordsByBaby = babies.reduce((acc, baby) => {
        acc[baby.id] = records.filter(r => r.babyId === baby.id);
        return acc;
    }, {} as Record<string, ActivityRecord[]>);

    // Find last activity for each baby
    const lastActivity = babies.reduce((acc, baby) => {
        const babyRecords = recordsByBaby[baby.id] || [];
        acc[baby.id] = babyRecords.length > 0 ? babyRecords[babyRecords.length - 1].timestamp : null;
        return acc;
    }, {} as Record<string, Date | null>);

    return (
        <div className="feeding-tracker" dir="rtl">
            <div className="managers-section">
                <BabyManager
                    babies={babies}
                    onAddBaby={(baby) => setBabies(prev => [...prev, baby])}
                    onDeleteBaby={(id) => setBabies(prev => prev.filter(b => b.id !== id))}
                />
                <ActionManager
                    actions={customActions}
                    onAddAction={(action) => setCustomActions(prev => [...prev, action])}
                    onDeleteAction={(id) => setCustomActions(prev => prev.filter(a => a.id !== id))}
                />
            </div>

            <div className="activity-form">
                <div className="form-group">
                    <label htmlFor="baby-select">תינוק:</label>
                    <select
                        id="baby-select"
                        value={selectedBaby}
                        onChange={(e) => setSelectedBaby(e.target.value)}
                        className="baby-select"
                        aria-label="בחרו תינוק"
                    >
                        <option value="">בחרו תינוק</option>
                        {babies.map(baby => (
                            <option key={baby.id} value={baby.id}>
                                {baby.name} {baby.gender === 'male' ? '👦' : '👧'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="action-select">פעולה:</label>
                    <select
                        id="action-select"
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        className="action-select"
                        aria-label="בחרו פעולה"
                    >
                        <option value="">בחרו פעולה</option>
                        {customActions.map(action => (
                            <option key={action.id} value={action.id}>
                                {action.icon} {action.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedAction === 'feeding' && (
                    <div className="form-group">
                        <label>כמות:</label>
                        <div className="amount-buttons">
                            {FEEDING_AMOUNTS.map(amount => (
                                <button
                                    key={amount.value}
                                    className={`amount-btn ${selectedAmount === amount.value ? 'selected' : ''}`}
                                    onClick={() => setSelectedAmount(amount.value)}
                                    type="button"
                                >
                                    {amount.icon} {amount.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="notes-input">הערות:</label>
                    <input
                        id="notes-input"
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="הוסיפו הערות..."
                        className="notes-input"
                        aria-label="הוסיפו הערות"
                    />
                </div>

                <button
                    className="add-record-btn"
                    onClick={addRecord}
                >
                    הוסיפו פעילות
                </button>
            </div>

            {errorPopup && (
                <div
                    className="modal-overlay"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="error-popup-title"
                    aria-describedby="error-popup-desc"
                    tabIndex={-1}
                >
                    <div className="modal" ref={errorPopupRef} style={{maxWidth: 320, textAlign: 'center'}}>
                        <h3 id="error-popup-title" style={{color: '#e91e63', fontSize: '1.2rem', marginBottom: 12}}>שגיאה</h3>
                        <div id="error-popup-desc" style={{marginBottom: 16}} aria-live="assertive">{errorPopup}</div>
                        <button
                            className="save-btn"
                            onClick={() => setErrorPopup(null)}
                            aria-label="סגור הודעת שגיאה"
                        >
                            סגור
                        </button>
                    </div>
                </div>
            )}

            <div className="records-section">
                {babies.map(baby => (
                    <div key={baby.id} className="baby-records" data-gender={baby.gender}>
                        <h2>{baby.name} {baby.gender === 'male' ? '👦' : '👧'}</h2>
                        <div className="last-activity">
                            ⏰ {getTimeAgoString(lastActivity[baby.id])}
                        </div>
                        {(!recordsByBaby[baby.id] || recordsByBaby[baby.id].length === 0) ? (
                            <p className="no-records">אין פעילויות עדיין! <span role="img" aria-label="sleeping">😴</span></p>
                        ) : (
                            <div className="records-list">
                                {recordsByBaby[baby.id].slice().reverse().map(record => (
                                    <div key={record.id} className="record-item">
                                        <span className="action-icon">
                                            {record.actionType === 'feeding' ? '🍼' : record.actionType === 'breastfeeding' ? '🤱' :
                                             customActions.find(a => a.id === record.customActionId)?.icon || '📝'}
                                        </span>
                                        <span className="action-details">
                                            {record.actionType === 'feeding' ?
                                                `האכלה ${record.amount} מ"ל` :
                                             record.actionType === 'breastfeeding' ?
                                                'הנקה' :
                                                customActions.find(a => a.id === record.customActionId)?.name || 'פעולה'}
                                            {record.notes && <span className="notes"> - {record.notes}</span>}
                                        </span>
                                        <span className="time">🕒 {formatTime(record.timestamp)}</span>
                                        <button
                                            className="delete-record-btn"
                                            onClick={() => deleteRecord(record.id)}
                                            title="מחק רשומה"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}; 