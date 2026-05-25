import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import chatService from '../../services/chatService';
import './Chat.css';

const ChatView = () => {
  const { user } = useAuth();
  const { socket } = useRealtime();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlConversationId = searchParams.get('conversationId');
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = user?.id;

  const activeConversation = conversations.find((conversation) => (
    String(conversation.id) === String(activeConversationId)
  ));

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách hội thoại');
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const appendMessage = useCallback((message) => {
    setMessages((prev) => {
      if (prev.some((item) => String(item.id) === String(message.id))) return prev;
      return [...prev, message];
    });
  }, []);

  const openConversation = useCallback(async (conversationId, shouldNavigate = true) => {
    if (!conversationId) return;
    setActiveConversationId(conversationId);
    setLoadingMessages(true);
    setError(null);

    if (shouldNavigate) {
      navigate(`/chat?conversationId=${conversationId}`);
    }

    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data.messages || []);
      setConversations((prev) => prev.map((conversation) => (
        String(conversation.id) === String(conversationId)
          ? { ...conversation, unread_count: 0 }
          : conversation
      )));
      await loadConversations();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải tin nhắn');
    } finally {
      setLoadingMessages(false);
    }
  }, [loadConversations, navigate]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (urlConversationId && String(urlConversationId) !== String(activeConversationId)) {
      openConversation(urlConversationId, false);
    }
  }, [activeConversationId, openConversation, urlConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;
    socket?.emit('conversation:join', { conversationId: activeConversationId });

    return () => {
      socket?.emit('conversation:leave', { conversationId: activeConversationId });
    };
  }, [activeConversationId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleIncomingMessage = async (message) => {
      if (String(message.conversation_id) === String(activeConversationId)) {
        appendMessage(message);
        if (String(message.sender_id) !== String(currentUserId)) {
          try {
            await chatService.markConversationRead(message.conversation_id);
          } catch (err) {
            console.error('Mark conversation read error', err);
          }
        }
      }
      loadConversations();
    };

    const handleConversationRead = ({ conversation_id }) => {
      setConversations((prev) => prev.map((conversation) => (
        String(conversation.id) === String(conversation_id)
          ? { ...conversation, unread_count: 0 }
          : conversation
      )));
    };

    const handleConversationUpdated = () => {
      loadConversations();
    };

    socket.on('chat:message', handleIncomingMessage);
    socket.on('chat:conversationRead', handleConversationRead);
    socket.on('chat:conversationUpdated', handleConversationUpdated);

    return () => {
      socket.off('chat:message', handleIncomingMessage);
      socket.off('chat:conversationRead', handleConversationRead);
      socket.off('chat:conversationUpdated', handleConversationUpdated);
    };
  }, [activeConversationId, appendMessage, currentUserId, loadConversations, socket]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const email = searchEmail.trim();
    if (email.length < 2) return;

    setSearching(true);
    setError(null);
    try {
      const data = await chatService.searchUsers(email);
      setSearchResults(data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tìm người dùng');
    } finally {
      setSearching(false);
    }
  };

  const handleCreateConversation = async (targetUser) => {
    setError(null);
    try {
      const data = await chatService.createConversation({ recipient_id: targetUser.id });
      await loadConversations();
      await openConversation(data.conversation.id);
      setSearchResults([]);
      setSearchEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo hội thoại');
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const content = messageText.trim();
    if (!content || !activeConversationId) return;

    setSending(true);
    setError(null);
    try {
      const data = await chatService.sendMessage({
        conversation_id: activeConversationId,
        content,
      });
      appendMessage(data.chatMessage);
      setMessageText('');
      await loadConversations();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const renderAvatar = (targetUser) => (
    <span className="chat-avatar">
      {targetUser?.avatar_url ? (
        <img src={targetUser.avatar_url} alt="avatar" />
      ) : (
        (targetUser?.full_name || targetUser?.email || '?').charAt(0).toUpperCase()
      )}
    </span>
  );

  const formatTime = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h1>Tin nhắn</h1>
        </div>

        <form className="chat-search" onSubmit={handleSearch}>
          <input
            type="email"
            value={searchEmail}
            onChange={(event) => setSearchEmail(event.target.value)}
            placeholder="Tìm theo email"
          />
          <button type="submit" disabled={searching || searchEmail.trim().length < 2}>
            Tìm
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="chat-search-results">
            {searchResults.map((result) => (
              <div key={result.id} className="chat-search-result">
                {renderAvatar(result)}
                <div className="chat-search-user">
                  <strong>{result.full_name || result.email}</strong>
                  <span>{result.email}</span>
                </div>
                <button type="button" onClick={() => handleCreateConversation(result)}>
                  Tạo
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="conversation-list">
          {loadingConversations && <div className="chat-muted">Đang tải...</div>}
          {!loadingConversations && conversations.length === 0 && (
            <div className="chat-muted">Chưa có hội thoại</div>
          )}
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`conversation-item${String(conversation.id) === String(activeConversationId) ? ' active' : ''}`}
              onClick={() => openConversation(conversation.id)}
            >
              {renderAvatar(conversation.other_user)}
              <span className="conversation-info">
                <span className="conversation-name">
                  {conversation.other_user?.full_name || conversation.other_user?.email || 'Người dùng'}
                </span>
                <span className="conversation-preview">
                  {conversation.last_message?.content || 'Hội thoại mới'}
                </span>
              </span>
              {conversation.unread_count > 0 && (
                <span className="conversation-count">{conversation.unread_count}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <main className="chat-main">
        {error && <div className="chat-error">{error}</div>}

        {!activeConversation ? (
          <div className="chat-empty-panel">
            <h2>Chọn một hội thoại</h2>
          </div>
        ) : (
          <>
            <div className="chat-thread-header">
              {renderAvatar(activeConversation.other_user)}
              <div>
                <h2>{activeConversation.other_user?.full_name || activeConversation.other_user?.email}</h2>
                <span>{activeConversation.other_user?.email}</span>
              </div>
            </div>

            <div className="message-list">
              {loadingMessages ? (
                <div className="chat-muted">Đang tải tin nhắn...</div>
              ) : (
                messages.map((message) => {
                  const isMine = String(message.sender_id) === String(currentUserId);
                  return (
                    <div key={message.id} className={`message-row${isMine ? ' mine' : ''}`}>
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        <span>{formatTime(message.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Nhập tin nhắn"
              />
              <button type="submit" disabled={sending || !messageText.trim()}>
                Gửi
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default ChatView;
