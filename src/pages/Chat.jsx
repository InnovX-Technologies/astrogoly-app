import React, { useState } from 'react';
import { Send, User, Sparkles, MoreVertical } from 'lucide-react';
import './Chat.css';

const astrologers = [
    { id: 1, name: "Acharya Vani", specialty: "Vedic, Numerology", exp: "15 Yrs", rating: 4.9, avatar: "👩‍🏫" },
    { id: 2, name: "Mystic Mohan", specialty: "Tarot, Psychic", exp: "8 Yrs", rating: 4.7, avatar: "👳‍♂️" },
    { id: 3, name: "Divine Divya", specialty: "Vastu, Palmistry", exp: "12 Yrs", rating: 4.8, avatar: "🧕" },
];

const mockMessages = [
    { id: 1, sender: 'bot', text: 'Namaste! Welcome to AstroGoly. How can I guide you today?' },
];

const Chat = () => {
    const [selectedAstrologer, setSelectedAstrologer] = useState(null);
    const [messages, setMessages] = useState(mockMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const newMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        // Simulated response
        setTimeout(() => {
            const responses = [
                "I see a strong planetary shift in your 5th house.",
                "That is a very interesting question. The cards suggest patience.",
                "Based on your birth time, this period is favorable for career growth.",
                "Could you share your exact date of birth for clarity?",
                "The stars indicate a new beginning is approaching."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: randomResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="container chat-page">
            {!selectedAstrologer ? (
                <div className="astrologer-list-view">
                    <div className="chat-header-main">
                        <h1>Chat with Astrologers</h1>
                        <p>Select an expert for instant guidance.</p>
                    </div>

                    <div className="astrologer-grid">
                        {astrologers.map(expert => (
                            <div key={expert.id} className="glass-panel expert-card">
                                <div className="expert-avatar">{expert.avatar}</div>
                                <div className="expert-info">
                                    <h3>{expert.name}</h3>
                                    <span className="specialty">{expert.specialty}</span>
                                    <div className="expert-stats">
                                        <span>⭐ {expert.rating}</span>
                                        <span>•</span>
                                        <span>{expert.exp} Exp</span>
                                    </div>
                                </div>
                                <button
                                    className="btn-primary-sm"
                                    onClick={() => setSelectedAstrologer(expert)}
                                >
                                    Chat
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="chat-interface glass-panel">
                    {/* Header */}
                    <div className="chat-window-header">
                        <button className="back-btn" onClick={() => setSelectedAstrologer(null)}>←</button>
                        <div className="chat-expert-profile">
                            <div className="avatar-sm">{selectedAstrologer.avatar}</div>
                            <div>
                                <h4>{selectedAstrologer.name}</h4>
                                <span className="online-status">● Online</span>
                            </div>
                        </div>
                        <button className="menu-btn"><MoreVertical size={20} /></button>
                    </div>

                    {/* Messages Area */}
                    <div className="messages-area">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.sender === 'user' ? 'me' : 'them'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-bubble them typing">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form className="chat-input-area" onSubmit={handleSend}>
                        <button type="button" className="action-btn"><Sparkles size={20} /></button>
                        <input
                            type="text"
                            placeholder="Type your question..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button type="submit" className="send-btn"><Send size={20} /></button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chat;
