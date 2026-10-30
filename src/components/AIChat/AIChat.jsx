import React, { useEffect, useRef, useState } from 'react'
import { FaPaperPlane, FaRobot, FaTimes, FaTrash, FaUtensils } from 'react-icons/fa'
import './AIChat.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const STORAGE_KEY = 'customer_ai_chat_history'

const suggestions = [
  'What do you recommend?',
  'Show me vegetarian options',
  'What is the cheapest item?',
  'Suggest something for dinner',
]

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : [
        {
          role: 'assistant',
          content: "Hi! 👋 I'm your AI food assistant. Ask me about our menu, prices, categories, or what you should try today.",
        },
      ]
    } catch {
      return [{
        role: 'assistant',
        content: "Hi! 👋 I'm your AI food assistant. How can I help you today?",
      }]
    }
  })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)))
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text = message) => {
    const cleanMessage = text.trim()
    if (!cleanMessage || loading) return

    const userMessage = { role: 'user', content: cleanMessage }
    const history = [...messages, userMessage].slice(-12)

    setMessages((prev) => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanMessage,
          history,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to get AI response')
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ])
    } catch (error) {
      console.error('AI chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not connect to the AI right now. Please try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage()
  }

  const clearChat = () => {
    const welcome = {
      role: 'assistant',
      content: "Chat cleared. 👋 What would you like to know about our menu?",
    }
    setMessages([welcome])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="ai-chat-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI food assistant"
        >
          <span className="ai-launcher-pulse" />
          <FaRobot />
          <span className="ai-launcher-label">AI Help</span>
        </button>
      )}

      {isOpen && (
        <section className="ai-chat-window" aria-label="AI food assistant">
          <header className="ai-chat-header">
            <div className="ai-chat-title-wrap">
              <div className="ai-chat-avatar"><FaRobot /></div>
              <div>
                <h3>AI Food Assistant</h3>
                <p><span className="ai-online-dot" /> Online • Menu assistant</p>
              </div>
            </div>

            <div className="ai-chat-header-actions">
              <button type="button" onClick={clearChat} aria-label="Clear chat" title="Clear chat">
                <FaTrash />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" title="Close chat">
                <FaTimes />
              </button>
            </div>
          </header>

          <div className="ai-chat-body">
            <div className="ai-chat-welcome">
              <FaUtensils />
              <div>
                <strong>Need a recommendation?</strong>
                <span>Ask me anything about the menu.</span>
              </div>
            </div>

            <div className="ai-chat-suggestions">
              {suggestions.map((item) => (
                <button key={item} type="button" onClick={() => sendMessage(item)} disabled={loading}>
                  {item}
                </button>
              ))}
            </div>

            <div className="ai-chat-messages">
              {messages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={`ai-message-row ${item.role}`}>
                  {item.role === 'assistant' && <div className="ai-small-avatar"><FaRobot /></div>}
                  <div className={`ai-message ${item.role}`}>
                    {item.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="ai-message-row assistant">
                  <div className="ai-small-avatar"><FaRobot /></div>
                  <div className="ai-message assistant ai-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form className="ai-chat-composer" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about food, prices, categories..."
              maxLength={500}
              disabled={loading}
              aria-label="Message AI assistant"
            />
            <button type="submit" disabled={!message.trim() || loading} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </form>
          <div className="ai-chat-footer">AI can make mistakes. Check important details before ordering.</div>
        </section>
      )}
    </>
  )
}

export default AIChat
