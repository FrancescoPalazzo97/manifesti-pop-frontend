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
            </div>

            {/* Finestra Chat */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '380px',
                        height: '550px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                        zIndex: 999,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #e8e8e8'
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            backgroundColor: '#D13B3B',
                            color: 'white',
                            padding: '18px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '17px',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: '#4CAF50',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)'
                                }}
                            ></div>
                            <span>Chatta con la nostra IA</span>
                        </div>
                        <button
                            onClick={clearChat}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                            aria-label="Pulisci chat"
                        >
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                        </button>
                    </div>

                    {/* Errore */}
                    {error && (
                        <div
                            style={{
                                backgroundColor: '#FFEBEE',
                                color: '#C62828',
                                padding: '12px 16px',
                                fontSize: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid #FFCDD2',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <span style={{ lineHeight: '1.5' }}>{error}</span>
                            <button
                                onClick={clearError}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#C62828',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    padding: '0 4px',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.backgroundColor = 'rgba(198, 40, 40, 0.1)'}
                                onMouseLeave={(e) => e.target.backgroundColor = 'transparent'}
                                aria-label="Chiudi messaggio di errore"
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
                            padding: '20px',
                            backgroundColor: '#f5f5f5',
                            backgroundImage: 'linear-gradient(to bottom, #fafafa 1px, transparent 1px)',
                            backgroundSize: '100% 10px'
                        }}
                    >
                        {messages.length === 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    color: '#757575',
                                    fontStyle: 'italic',
                                    marginTop: '50px',
                                    padding: '20px',
                                    lineHeight: '1.6',
                                    fontSize: '15px'
                                }}
                            >
                                <div style={{ marginBottom: '12px', fontSize: '24px' }}>👋</div>
                                <div style={{ fontWeight: '500', marginBottom: '8px' }}>Ciao! Sono qui per aiutarti.</div>
                                <div style={{ fontSize: '14px' }}>Fammi qualsiasi domanda e ti risponderò al meglio delle mie capacità.</div>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '16px',
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '85%',
                                        padding: '12px 16px',
                                        borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        backgroundColor: msg.role === 'user' ? '#D13B3B' : 'white',
                                        color: msg.role === 'user' ? 'white' : '#424242',
                                        fontSize: '15px',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-wrap',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                                        border: msg.role === 'assistant' ? '1px solid #e0e0e0' : 'none',
                                        wordBreak: 'break-word'
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
                                    marginBottom: '16px'
                                }}
                            >
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '18px 18px 18px 4px',
                                        backgroundColor: 'white',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '15px',
                                        color: '#616161',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#D13B3B',
                                                    animation: `pulse 1.4s ${i * 0.2}s infinite`
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                    <span>Sto elaborando la risposta...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <div
                        style={{
                            padding: '16px',
                            backgroundColor: 'white',
                            borderTop: '1px solid #e8e8e8',
                            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.03)'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                placeholder="Scrivi un messaggio..."
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '24px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    backgroundColor: loading ? '#f5f5f5' : 'white',
                                    color: '#424242'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#D13B3B';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(209, 59, 59, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                                aria-label="Messaggio"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: loading || !input.trim() ? '#e0e0e0' : '#D13B3B',
                                    color: 'white',
                                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    transform: loading || !input.trim() ? 'none' : 'scale(1.05)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading && input.trim()) {
                                        e.target.style.backgroundColor = '#B22A2A';
                                        e.target.style.transform = 'scale(1.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading && input.trim()) {
                                        e.target.style.backgroundColor = '#D13B3B';
                                        e.target.style.transform = 'scale(1.05)';
                                    }
                                }}
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

            {/* CSS per l'animazione */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 60%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    30% {
                        transform: scale(1.2);
                        opacity: 0.7;
                    }
                }
            `}</style>
        </>
    );
};

export default Chat;