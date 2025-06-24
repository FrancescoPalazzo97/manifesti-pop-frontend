import { useState } from 'react';
import axios from 'axios';
import '../styles/chat.css'; // Creeremo questo file CSS separato

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/chat', {
                message: input
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const aiMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Errore:', error);

            let errorMessage = 'Errore nella comunicazione';
            if (error.response) {
                errorMessage = error.response.data?.error || `Errore ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Server non raggiungibile';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Timeout della richiesta';
            }

            setError(errorMessage);
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearError = () => {
        setError(null);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="chat-container">
            {/* Bottone floating */}
            <button
                className={`chat-toggle-button ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Chiudi chat' : 'Apri chat'}
            >
                {isOpen ? (
                    <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                ) : (
                    <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                )}
            </button>

            {/* Finestra Chat */}
            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-title">
                            <div className="chat-status-indicator"></div>
                            <span>Chatta con la nostra IA</span>
                        </div>
                        <button
                            className="chat-clear-button"
                            onClick={clearChat}
                            aria-label="Pulisci chat"
                        >
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                        </button>
                    </div>

                    {/* Errore */}
                    {error && (
                        <div className="chat-error-message">
                            <span>{error}</span>
                            <button
                                className="chat-error-close"
                                onClick={clearError}
                                aria-label="Chiudi messaggio di errore"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Area messaggi */}
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="chat-welcome-message">
                                <div className="chat-welcome-icon">👋</div>
                                <div className="chat-welcome-text">
                                    <h4>Ciao! Sono qui per aiutarti.</h4>
                                    <p>Fammi qualsiasi domanda e ti risponderò al meglio delle mie capacità.</p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message-container ${msg.role === 'user' ? 'user' : 'assistant'}`}
                            >
                                <div className={`message-bubble ${msg.role}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="message-container assistant">
                                <div className="message-bubble loading">
                                    <div className="typing-indicator">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                        ))}
                                    </div>
                                    <span>Sto elaborando la risposta...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <div className="chat-input-area">
                        <div className="chat-input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                placeholder="Scrivi un messaggio..."
                                className="chat-text-input"
                                aria-label="Messaggio"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="chat-send-button"
                                aria-label="Invia messaggio"
                            >
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;