import { useState, useEffect, useRef } from 'react'
import firebase from '../lib/firebaseClient'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadChatHistory()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const snapshot = await firebase.database.ref('chatbot/history').get()
      const history = snapshot.val()
      if (history && Array.isArray(history)) {
        setMessages(history)
      }
    } catch (err) {
      console.error('Error loading chat history:', err)
    }
  }

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase()

    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return '👋 Hello! How can I help you with your shopping today?'
    }
    if (msg.includes('buy')) {
      return '🛒 To buy: Click any product > Add to Cart > Go to Cart page > Checkout!'
    }
    if (msg.includes('sell')) {
      return '💰 To sell: Click Sell > Login > Fill product details > Upload image > List!'
    }
    if (msg.includes('product')) {
      return '📦 Browse all products on the home page. Click any to see details and seller info!'
    }
    if (msg.includes('shipping')) {
      return '🚚 Contact the seller directly using the phone number in the order.'
    }
    if (msg.includes('account')) {
      return '👤 Sign up: Click Login > Sign up > Enter email, password, name, phone.'
    }
    return '😊 Ask me about buying, selling, accounts, or shipping!'
  }

  const handleSend = async () => {
    if (!input.trim()) return

    setLoading(true)

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    await new Promise(r => setTimeout(r, 600))

    const botResponse = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(input),
      sender: 'bot',
      timestamp: new Date().toISOString()
    }

    const updated = [...messages, userMessage, botResponse]
    setMessages(updated)

    try {
      await firebase.database.ref('chatbot/history').set(updated)
    } catch (err) {
      console.error('Error saving chat:', err)
    }

    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '75px',
          height: '75px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontSize: '2.5rem',
          cursor: 'pointer',
          boxShadow: '0 10px 35px rgba(102, 126, 234, 0.6)',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          bottom: '2rem',
          right: '2rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.2) rotate(-15deg)'
          e.currentTarget.style.boxShadow = '0 15px 45px rgba(102, 126, 234, 0.8)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
          e.currentTarget.style.boxShadow = '0 10px 35px rgba(102, 126, 234, 0.6)'
        }}
        title={isOpen ? 'Close Chat' : 'Open Chat'}
      >
        {isOpen ? '×' : '💬'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '6.5rem',
            right: '2rem',
            width: '450px',
            maxHeight: '700px',
            background: '#ffffff',
            borderRadius: '1.75rem',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            overflow: 'hidden',
            border: '1px solid rgba(102, 126, 234, 0.15)',
            animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Header with gradient and icon */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1.5rem',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            <span style={{ fontSize: '2rem', position: 'relative', zIndex: 1 }}>💬</span>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div>Support Assistant</div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 'normal',
                opacity: 0.9,
                letterSpacing: '0.5px'
              }}>
                Always ready to help
              </div>
            </div>
          </div>

          {/* Messages Container with gradient background */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            background: 'linear-gradient(180deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.8) 100%)',
            backgroundAttachment: 'fixed',
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)
            `
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#9ca3af',
                padding: '2rem 1rem',
                fontSize: '0.95rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>👋</div>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280' }}>
                  Welcome to Support!
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  Ask me anything about buying, selling, or your account.
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeInMessage 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '1rem 1.25rem',
                    borderRadius: msg.sender === 'user'
                      ? '1.25rem 1.25rem 0.25rem 1.25rem'
                      : '1.25rem 1.25rem 1.25rem 0.25rem',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    color: msg.sender === 'user' ? 'white' : '#1f2937',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    boxShadow: msg.sender === 'user'
                      ? '0 8px 16px rgba(102, 126, 234, 0.4)'
                      : '0 4px 12px rgba(0, 0, 0, 0.08)',
                    border: msg.sender === 'user'
                      ? 'none'
                      : '1px solid rgba(102, 126, 234, 0.1)'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '1rem', background: 'white', borderRadius: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div className="loading" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '2px' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '1.25rem',
              background: 'white',
              borderTop: '1px solid var(--gray-100)',
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              style={{
                flex: 1,
                padding: '0.875rem 1.25rem',
                borderRadius: '1rem',
                border: '2px solid var(--gray-100)',
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                background: 'var(--gray-50)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.background = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--gray-100)';
                e.target.style.background = 'var(--gray-50)';
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                padding: '0 1.25rem',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.6 : 1,
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInMessage {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
