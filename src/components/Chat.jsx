import { useState } from 'react'
import axios from 'axios'

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
        <>
            {/* Bottone floating */}
            <div
                onClick={toggleChat}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#D13B3B',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(209, 59, 59, 0.3)',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                    border: 'none'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.backgroundColor = '#B22A2A';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.backgroundColor = '#D13B3B';
                }}
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
            </div>

            {/* Finestra Chat */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '350px',
                        height: '500px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        zIndex: 999,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            backgroundColor: '#D13B3B',
                            color: 'white',
                            padding: '15px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: '#28a745',
                                    borderRadius: '50%'
                                }}
                            ></div>
                            Chatta con la nostra IA
                        </div>
                        <button
                            onClick={clearChat}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}
                            title="Pulisci chat"
                        >
                            🗑️
                        </button>
                    </div>

                    {/* Errore */}
                    {error && (
                        <div
                            style={{
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                padding: '10px 15px',
                                fontSize: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>{error}</span>
                            <button
                                onClick={clearError}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#721c24',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Area messaggi */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '15px',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        {messages.length === 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    color: '#6c757d',
                                    fontStyle: 'italic',
                                    marginTop: '50px'
                                }}
                            >
                                👋 Ciao! Come posso aiutarti oggi?
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '15px',
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '80%',
                                        padding: '10px 12px',
                                        borderRadius: '18px',
                                        backgroundColor: msg.role === 'user' ? '#D13B3B' : 'white',
                                        color: msg.role === 'user' ? 'white' : '#333',
                                        fontSize: '14px',
                                        lineHeight: '1.4',
                                        whiteSpace: 'pre-wrap',
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                        border: msg.role === 'assistant' ? '1px solid #e0e0e0' : 'none'
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    marginBottom: '15px'
                                }}
                            >
                                <div
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: '18px',
                                        backgroundColor: 'white',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '14px',
                                        color: '#6c757d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#D13B3B',
                                            animation: 'pulse 1.5s infinite'
                                        }}
                                    ></div>
                                    Gemini sta scrivendo...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <div
                        style={{
                            padding: '15px',
                            backgroundColor: 'white',
                            borderTop: '1px solid #e0e0e0'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                placeholder="Scrivi un messaggio..."
                                style={{
                                    flex: 1,
                                    padding: '10px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#D13B3B'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: loading || !input.trim() ? '#ddd' : '#D13B3B',
                                    color: 'white',
                                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS per l'animazione */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 70%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    35% {
                        transform: scale(1.3);
                        opacity: 0.7;
                    }
                }
            `}</style>
        </>
    );
};

export default Chat