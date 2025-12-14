import React, { useState } from 'react';
import './Tarot.css';

const majorArcana = [
    { name: "The Fool", meaning: "New beginnings, optimism, trust in life.", icon: "🤡" },
    { name: "The Magician", meaning: "Action, the power to manifest.", icon: "🪄" },
    { name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine.", icon: "🌙" },
    { name: "The Empress", meaning: "Fertility, femininity, beauty, nature.", icon: "👑" },
    { name: "The Emperor", meaning: "Authority, establishment, structure.", icon: "🤴" },
    { name: "The Hierophant", meaning: "Spiritual wisdom, religious beliefs, conformity.", icon: "🕍" },
    { name: "The Lovers", meaning: "Love, harmony, relationships, values alignment.", icon: "❤️" },
    { name: "The Chariot", meaning: "Control, willpower, success, action.", icon: "🛒" },
    { name: "Strength", meaning: "Strength, courage, persuasion, influence.", icon: "🦁" },
    { name: "The Hermit", meaning: "Soul-searching, introspection, being alone.", icon: "🕯️" },
    { name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles, destiny.", icon: "🎡" },
    { name: "Justice", meaning: "Justice, fairness, truth, cause and effect.", icon: "⚖️" },
    { name: "The Hanged Man", meaning: "Pause, surrender, letting go, new perspectives.", icon: "🙃" },
    { name: "Death", meaning: "Endings, change, transformation, transition.", icon: "💀" },
    { name: "Temperance", meaning: "Balance, moderation, patience, purpose.", icon: "🥤" },
    { name: "The Devil", meaning: "Shadow self, attachment, addiction, restriction.", icon: "😈" },
    { name: "The Tower", meaning: "Sudden change, upheaval, chaos, revelation.", icon: "⚡" },
    { name: "The Star", meaning: "Hope, faith, purpose, renewal, spirituality.", icon: "⭐" },
    { name: "The Moon", meaning: "Illusion, fear, anxiety, subconscious, intuition.", icon: "🌔" },
    { name: "The Sun", meaning: "Positivity, fun, warmth, success, vitality.", icon: "☀️" },
    { name: "Judgement", meaning: "Judgement, rebirth, inner calling, absolution.", icon: "🎺" },
    { name: "The World", meaning: "Completion, integration, accomplishment, travel.", icon: "🌍" }
];

const Tarot = () => {
    const [card, setCard] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);

    const drawCard = () => {
        if (isFlipping) return;
        setIsFlipping(true);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * majorArcana.length);
            setCard(majorArcana[randomIndex]);
            setIsFlipping(false);
        }, 1000);
    };

    const reset = () => {
        setCard(null);
    };

    return (
        <div className="container tarot-page">
            <div className="tarot-header">
                <h1>Tarot Reading</h1>
                <p>Focus on your question, breathe deeply, and reveal your destiny.</p>
            </div>

            <div className="card-container">
                {!card ? (
                    <div
                        className={`tarot-card back ${isFlipping ? 'shuffling' : ''}`}
                        onClick={drawCard}
                    >
                        <div className="card-pattern"></div>
                    </div>
                ) : (
                    <div className="flip-container">
                        <div className="tarot-card front animate-reveal">
                            <div className="card-inner">
                                <div className="card-icon">{card.icon}</div>
                                <h2>{card.name}</h2>
                                <div className="card-divider"></div>
                                <p>{card.meaning}</p>
                            </div>
                        </div>
                        <button className="btn-outline mt-4" onClick={reset}>Draw Another Card</button>
                    </div>
                )}
            </div>

            {!card && !isFlipping && (
                <p className="instruction">Tap the card to reveal</p>
            )}
        </div>
    );
};

export default Tarot;
