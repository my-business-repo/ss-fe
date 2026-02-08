import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import EmojiPicker from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { getApiUrl } from '../config/api';

interface Message {
  id: string;
  sender: 'customer-service' | 'user';
  content?: string;
  image?: string;
  timestamp: string;
  createdAt?: any;
}

export default function Chat() {
  const navigate = useNavigate();
  const { user, token, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading chat...</div>;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user?.user_id) return;

    const messagesRef = collection(db, 'chats', user.user_id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        let timeDisplay = '';
        if (data.createdAt) {
          try {
            const date = (data.createdAt as Timestamp).toDate();
            timeDisplay = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
          } catch (e) {
            console.error("Timestamp error", e);
            timeDisplay = "Invalid Date";
          }
        }

        return {
          id: doc.id,
          sender: data.sender,
          content: data.content || data.text || '',
          image: data.img || data.image,
          timestamp: timeDisplay,
          createdAt: data.createdAt
        };
      });
      setMessages(msgs);
      setTimeout(scrollToBottom, 100);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [user?.user_id]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && user?.user_id) {
      try {
        const messagesRef = collection(db, 'chats', user.user_id, 'messages');
        await addDoc(messagesRef, {
          sender: 'user',
          text: inputMessage,
          content: inputMessage,
          createdAt: serverTimestamp()
        });
        setInputMessage('');
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  const handleImageUpload = async (file: File) => {
    if (!user?.user_id || !token) {
      alert('Please login to send images');
      return;
    }

    setIsUploadingImage(true);
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend API
      const response = await fetch(getApiUrl('v1/customer/chat/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Send image URL to Firebase
      const messagesRef = collection(db, 'chats', user.user_id, 'messages');
      await addDoc(messagesRef, {
        sender: 'user',
        img: data.url,
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Image size must be less than 5MB');
        return;
      }

      handleImageUpload(file);
    }
    // Reset input value to allow uploading the same file again
    event.target.value = '';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="chat-page">
      {/* Header remain same */}
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
        {/* ... messages list ... */}
        <div className="chat-empty-state">Here is history messages</div>

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              {message.sender === 'customer-service' && (
                <div className="message-sender">Customer Service {message.timestamp}</div>
              )}
              <div className="message-bubble">
                {message.image && (
                  <img src={message.image} alt="uploaded" style={{ maxWidth: '200px', borderRadius: 8, marginBottom: message.content ? 8 : 0 }} />
                )}
                {message.content && (message.content).split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          ))}

          {/* Loading indicator for image upload */}
          {isUploadingImage && (
            <div className="message user" style={{ opacity: 0.7 }}>
              <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Uploading image...</span>
                <span className="loading-dots">⏳</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer" style={{ position: 'relative' }}>
        {showEmojiPicker && (
          <div ref={emojiPickerRef} style={{ position: 'absolute', bottom: '80px', left: '20px', zIndex: 10 }}>
            <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
          </div>
        )}

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

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <div className="chat-actions">
          <button className="action-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <EmojiEmotionsIcon />
          </button>
          <button
            className="action-btn"
            onClick={handleImageClick}
            disabled={isUploadingImage}
            style={{ opacity: isUploadingImage ? 0.5 : 1 }}
          >
            <ImageIcon />
            {isUploadingImage && <span style={{ fontSize: '10px', position: 'absolute', bottom: '2px' }}>...</span>}
          </button>
          {/* Removed PlayCircleIcon video button */}
          <button className="send-btn" onClick={() => { handleSendMessage(); setShowEmojiPicker(false); }}>
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
          padding: var(--space-xl) var(--space-xl) 80px; /* Added bottom padding for scroll space */
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
          gap: var(--space-xl); /* Increased gap */
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
          margin-bottom: 2px;
        }

        .message-bubble {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-lg);
          padding: 14px 20px; /* Explicit ample padding */
          max-width: 80%;
          word-wrap: break-word;
          color: var(--color-text-primary);
          font-size: var(--font-size-base); /* Slightly larger text */
          line-height: 1.5;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Subtle shadow for depth */
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
