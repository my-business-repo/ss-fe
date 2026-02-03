import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface Message {
    id: number;
    sender: 'customer-service' | 'user';
    content: string;
    timestamp: string;
}

export default function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'customer-service',
            content: '00:26:02 | Customer Service | established a session with you',
            timestamp: '00:26'
        },
        {
            id: 2,
            sender: 'customer-service',
            content: 'Hello and welcome!\n\nPlatform latest recharge TRC20 address:\nTHP1jqVaa2R1Qt3Ue1opKWuvoxOvp6Okm\n\nPlatform latest recharge ERC20 address:\n0x6fBba0CC7D7e4D12B4321BelyS6rAwcPFFEM7B74a\n\nPlease let us know if you have any other questions!',
            timestamp: '00:26:02'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: 'user',
                content: inputMessage,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setInputMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="chat-page">
            <header className="chat-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </button>
                <div className="header-content">
                    <div className="avatar-container">
                        <div className="avatar">👤</div>
                    </div>
                    <span className="header-title">Customer Service</span>
                </div>
                <button className="volume-btn">
                    <VolumeUpIcon />
                </button>
            </header>

            <main className="chat-content">
                <div className="chat-empty-state">Here is history messages</div>

                <div className="messages-container">
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            {message.sender === 'customer-service' && (
                                <div className="message-sender">Customer Service {message.timestamp}</div>
                            )}
                            <div className="message-bubble">
                                {message.content.split('\n').map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="chat-footer">
                <div className="input-container">
                    <input
                        type="text"
                        className="message-input"
                        placeholder="Please enter message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <div className="chat-actions">
                    <button className="action-btn">
                        <EmojiEmotionsIcon />
                    </button>
                    <button className="action-btn">
                        <ImageIcon />
                    </button>
                    <button className="action-btn">
                        <PlayCircleIcon />
                    </button>
                    <button className="send-btn" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </footer>

            <style>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--color-bg-primary);
        }

        .chat-header {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-md);
        }

        .back-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .back-btn svg {
          font-size: 24px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .avatar-container {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar {
          font-size: 24px;
        }

        .header-title {
          color: #ffffff;
          font-size: var(--font-size-lg);
          font-weight: 600;
        }

        .volume-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .volume-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .volume-btn svg {
          font-size: 24px;
        }

        .chat-content {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-xl);
          background: var(--color-bg-primary);
        }

        .chat-empty-state {
          text-align: center;
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
          padding: var(--space-lg) 0;
        }

        .messages-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          max-width: 800px;
          margin: 0 auto;
        }

        .message {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .message.customer-service {
          align-items: flex-start;
        }

        .message.user {
          align-items: flex-end;
        }

        .message-sender {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          padding: 0 var(--space-sm);
        }

        .message-bubble {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-lg);
          padding: var(--space-md) var(--space-lg);
          max-width: 80%;
          word-wrap: break-word;
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);
          line-height: 1.6;
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
        }

        .chat-footer {
          background: var(--color-bg-secondary);
          border-top: 1px solid var(--color-border-primary);
          padding: var(--space-lg) var(--space-xl);
        }

        .input-container {
          margin-bottom: var(--space-md);
        }

        .message-input {
          width: 100%;
          padding: var(--space-md) var(--space-lg);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-base);
          transition: all var(--transition-fast);
        }

        .message-input:focus {
          outline: none;
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px var(--color-accent-primary-alpha);
        }

        .message-input::placeholder {
          color: var(--color-text-tertiary);
        }

        .chat-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .action-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        .action-btn svg {
          font-size: 24px;
        }

        .send-btn {
          margin-left: auto;
          padding: var(--space-sm) var(--space-xl);
          background: #60a5fa;
          border: none;
          border-radius: var(--radius-md);
          color: #ffffff;
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .send-btn:hover {
          background: #3b82f6;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: var(--space-md) var(--space-lg);
          }

          .back-btn {
            width: 36px;
            height: 36px;
          }

          .back-btn svg {
            font-size: 20px;
          }

          .header-title {
            font-size: var(--font-size-base);
          }

          .chat-content {
            padding: var(--space-lg);
          }

          .message-bubble {
            max-width: 90%;
            font-size: var(--font-size-xs);
          }

          .chat-footer {
            padding: var(--space-md) var(--space-lg);
          }
        }

        @media (max-width: 480px) {
          .chat-header {
            padding: var(--space-sm) var(--space-md);
          }

          .back-btn {
            width: 32px;
            height: 32px;
          }

          .back-btn svg {
            font-size: 18px;
          }

          .avatar-container {
            width: 32px;
            height: 32px;
          }

          .avatar {
            font-size: 20px;
          }

          .header-title {
            font-size: var(--font-size-sm);
          }

          .volume-btn {
            width: 32px;
            height: 32px;
          }

          .volume-btn svg {
            font-size: 20px;
          }

          .chat-content {
            padding: var(--space-md);
          }

          .message-bubble {
            max-width: 95%;
          }

          .chat-footer {
            padding: var(--space-sm) var(--space-md);
          }

          .chat-actions {
            gap: var(--space-sm);
          }

          .action-btn {
            width: 36px;
            height: 36px;
          }

          .action-btn svg {
            font-size: 20px;
          }

          .send-btn {
            padding: var(--space-xs) var(--space-lg);
          }
        }
      `}</style>
        </div>
    );
}
