import React, { useState } from 'react';
import { Sparkles, RefreshCcw, LayoutGrid, CreditCard, Info } from 'lucide-react';
import './Tarot.css';

const majorArcana = [
    { name: "The Fool", meaning: "A fresh start, innocence, and spontaneity. Embrace the journey with an open heart.", icon: "🃏", keyword: "Innocence" },
    { name: "The Magician", meaning: "Manifestation, resourcefulness, and power. You have all the tools to succeed.", icon: "🪄", keyword: "Manifestation" },
    { name: "The High Priestess", meaning: "Intuition, sacred knowledge, and the subconscious. Trust your inner voice.", icon: "🌙", keyword: "Intuition" },
    { name: "The Empress", meaning: "Femininity, beauty, nature, and abundance. Nurture your creative seeds.", icon: "👸", keyword: "Abundance" },
    { name: "The Emperor", meaning: "Authority, structure, and solid foundations. Time to lead with discipline.", icon: "🤴", keyword: "Authority" },
    { name: "The Hierophant", meaning: "Spiritual wisdom, tradition, and belief systems. Seek knowledge from masters.", icon: "🕍", keyword: "Tradition" },
    { name: "The Lovers", meaning: "Love, harmony, and choices. Align your heart with your higher values.", icon: "❤️", keyword: "Harmony" },
    { name: "The Chariot", meaning: "Victory, willpower, and determination. Drive through obstacles with focus.", icon: "🛒", keyword: "Victory" },
    { name: "Strength", meaning: "Courage, persuasion, and gentle power. Tame your inner beasts with love.", icon: "🦁", keyword: "Courage" },
    { name: "The Hermit", meaning: "Introspection, soul-searching, and inner guidance. Withdrawal for clarity.", icon: "🕯️", keyword: "Insight" },
    { name: "Wheel of Fortune", meaning: "Good luck, destiny, and turning points. The universe is moving in your favor.", icon: "🎡", keyword: "Karma" },
    { name: "Justice", meaning: "Fairness, truth, and cause & effect. Balance your scales and act with integrity.", icon: "⚖️", keyword: "Truth" },
    { name: "The Hanged Man", meaning: "New perspective, surrender, and letting go. Sacrifice the old for the new.", icon: "🙃", keyword: "Perspective" },
    { name: "Death", meaning: "Transformation, transition, and major endings. Clear the way for new growth.", icon: "💀", keyword: "Rebirth" },
    { name: "Temperance", meaning: "Balance, moderation, and alchemy. Blend your experiences into harmony.", icon: "🥤", keyword: "Balance" },
    { name: "The Devil", meaning: "Attachment, addiction, and restriction. Break free from your self-imposed chains.", icon: "😈", keyword: "Freedom" },
    { name: "The Tower", meaning: "Sudden upheaval, chaos, and revelation. Foundations are crumbling for a reason.", icon: "⚡", keyword: "Revolution" },
    { name: "The Star", meaning: "Hope, faith, and inspiration. A bright future is emerging from the darkness.", icon: "⭐", keyword: "Hope" },
    { name: "The Moon", meaning: "Illusion, fear, and subconscious anxiety. Look beneath the surface of things.", icon: "🌔", keyword: "Intuition" },
    { name: "The Sun", keyword: "Success", meaning: "Vitality, success, and joy. You are walking in the light of truth.", icon: "☀️" },
    { name: "Judgement", keyword: "Calling", meaning: "Absolution, rebirth, and inner calling. It is time to step into your power.", icon: "🎺" },
    { name: "The World", keyword: "Completion", meaning: "Accomplishment, travel, and integration. You have completed a major cycle.", icon: "🌍" }
];

const Tarot = () => {
    const [spread, setSpread] = useState('single'); // 'single' or 'three'
    const [cards, setCards] = useState([]);
    const [isFlipping, setIsFlipping] = useState(false);

    const drawCards = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        setCards([]);

        setTimeout(() => {
            const count = spread === 'single' ? 1 : 3;
            const newCards = [];
            const indices = new Set();

            while (indices.size < count) {
                indices.add(Math.floor(Math.random() * majorArcana.length));
            }

            indices.forEach(idx => newCards.push(majorArcana[idx]));
            setCards(newCards);
            setIsFlipping(false);
        }, 1200);
    };

    const reset = () => {
        setCards([]);
    };

    return (
        <div className="tarot-container">
            <div className="container">
                <header className="tarot-header">
                    <div className="spread-selector">
                        <button
                            className={`s-btn ${spread === 'single' ? 'active' : ''}`}
                            onClick={() => { setSpread('single'); reset(); }}
                        >
                            <CreditCard size={18} />
                            <span>Single Card</span>
                        </button>
                        <button
                            className={`s-btn ${spread === 'three' ? 'active' : ''}`}
                            onClick={() => { setSpread('three'); reset(); }}
                        >
                            <LayoutGrid size={18} />
                            <span>3-Card Spread</span>
                        </button>
                    </div>
                    <h1>Digital Tarot Sanctuary</h1>
                    <p>Seek guidance from the archetypes of the universe.</p>
                </header>

                <div className={`spread-area ${spread}`}>
                    {cards.length === 0 ? (
                        <div className="deck-container" onClick={drawCards}>
                            <div className={`deck-visual ${isFlipping ? 'shuffling' : ''}`}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="deck-card-proxy" style={{ transform: `translateY(${i * -2}px) rotate(${i * 0.5}deg)` }}></div>
                                ))}
                                <div className="deck-card-top back">
                                    <div className="card-ornament"></div>
                                    <Sparkles className="ornament-icon" size={32} />
                                </div>
                            </div>
                            <p className="deck-instruction">
                                {isFlipping ? 'Shuffling the stars...' : 'Tap the deck to draw your cards'}
                            </p>
                        </div>
                    ) : (
                        <div className="results-container">
                            <div className="cards-grid">
                                {cards.map((card, i) => (
                                    <div key={i} className="revealed-card-wrapper animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                                        {spread === 'three' && (
                                            <span className="card-position">
                                                {['The Past', 'The Present', 'The Future'][i]}
                                            </span>
                                        )}
                                        <div className="tarot-card-reveal glass-panel">
                                            <div className="c-head">
                                                <span className="c-keyword">{card.keyword || 'Insight'}</span>
                                            </div>
                                            <div className="c-body">
                                                <div className="c-icon">{card.icon}</div>
                                                <h2>{card.name}</h2>
                                                <div className="c-divider"></div>
                                                <p>{card.meaning}</p>
                                            </div>
                                            <div className="c-footer">
                                                <Info size={14} />
                                                <span>Major Arcana</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="tarot-actions">
                                <button className="btn-outline" onClick={reset}>
                                    <RefreshCcw size={18} />
                                    <span>Reset Spread</span>
                                </button>
                                <button className="btn-primary" onClick={drawCards}>Draw Again</button>
                            </div>
                        </div>
                    )}
                </div>

                <section className="tarot-wisdom glass-panel">
                    <div className="wisdom-content">
                        <h3>How to read your Tarot?</h3>
                        <p>
                            Tarot is a mirror to the subconscious. Focus on your question or area of life.
                            The <strong>Single Card</strong> spread is best for quick daily guidance,
                            while the <strong>3-Card Spread</strong> provides a narrative of how your past
                            is influencing your present and shaping your likely future.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Tarot;
