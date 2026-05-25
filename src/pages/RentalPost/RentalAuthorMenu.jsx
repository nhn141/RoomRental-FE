import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';

const RentalAuthorMenu = ({ post, compact = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

  const landlordId = post?.landlord_id;
  const landlordName = post?.landlord_name || post?.landlord_email || 'Người đăng';
  const isCurrentUser = String(user?.id) === String(landlordId);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleViewProfile = () => {
    setOpen(false);
    navigate(`/users/${landlordId}`);
  };

  const handleSendMessage = async () => {
    if (!landlordId || isCurrentUser) return;

    setSending(true);
    setError(null);
    try {
      const data = await chatService.sendMessage({
        recipient_id: landlordId,
        post_id: post.id,
        content: `Xin chào, mình muốn trao đổi về bài đăng "${post.title}".`,
      });
      setOpen(false);
      navigate(`/chat?conversationId=${data.conversation.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  if (!landlordId) return null;

  return (
    <div className={`rental-author${compact ? ' compact' : ''}`} ref={menuRef}>
      <button
        type="button"
        className="rental-author-avatar"
        title={landlordName}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {post.landlord_avatar_url ? (
          <img src={post.landlord_avatar_url} alt="avatar" />
        ) : (
          landlordName.charAt(0).toUpperCase()
        )}
      </button>
      <div className="rental-author-info">
        <span>Người đăng</span>
        <strong>{landlordName}</strong>
      </div>

      {open && (
        <div className="rental-author-popover" role="menu">
          <button type="button" onClick={handleViewProfile}>
            Xem hồ sơ
          </button>
          {!isCurrentUser && (
            <button type="button" onClick={handleSendMessage} disabled={sending}>
              {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          )}
          {error && <div className="rental-author-error">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default RentalAuthorMenu;
