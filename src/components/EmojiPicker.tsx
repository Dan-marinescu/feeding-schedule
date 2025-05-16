import React from 'react';

const COMMON_EMOJIS = [
    '🍼', '💧', '💩', '💊', '🧷', '😴', '😊', '😢',
    '🤒', '🤧', '🤮', '🤢', '😴', '😪', '😫', '😩',
    '😤', '😡', '😠', '😭', '😢', '😥', '😓', '😰',
    '😨', '😱', '😖', '😣', '😞', '😔', '😟', '😕',
    '😮', '😯', '😲', '😳', '😦', '😧', '😨', '😰',
    '😥', '😢', '😭', '😤', '😠', '😡', '😈', '👿',
    '👶', '👧', '👦', '👩', '👨', '👵', '👴', '👼',
    '🎈', '🎁', '🎂', '🎉', '🎊', '🎀', '🎗️', '🎟️',
];

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
    return (
        <div className="emoji-picker">
            {COMMON_EMOJIS.map((emoji, index) => (
                <button
                    key={index}
                    className="emoji-option"
                    onClick={() => onSelect(emoji)}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}; 