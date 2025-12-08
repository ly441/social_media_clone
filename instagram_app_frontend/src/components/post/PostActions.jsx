import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { postAPI } from "../../services/api";
import toast from "react-hot-toast";
import styled from "styled-components";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiSend,
  FiCopy,
  FiFlag,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const ActionsContainer = styled.div`
  padding: 8px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: ${(props) => (props.active ? props.activeColor : "#65676b")};
  font-weight: 600;
  font-size: 14px;
  flex: 1;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f0f2f5;
  }
`;

const ActionCount = styled.span`
  margin-left: 4px;
  font-weight: normal;
`;

const ShareMenu = styled.div`
  position: relative;
`;

const ShareDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ShareOption = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #1c1e21;

  &:hover {
    background: #f0f2f5;
  }

  svg {
    font-size: 18px;
    color: #65676b;
  }
`;

const PostActions = ({
  postId,
  initialLikesCount,
  initialIsLiked,
  commentsCount,
  onLikeChange,
  onShare,
  onCommentClick,
}) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await postAPI.like(postId);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likes_count);

      if (onLikeChange) {
        onLikeChange(response.data.liked, response.data.likes_count);
      }
    } catch (error) {
      toast.error("Failed to like post");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (method) => {
    setShowShareMenu(false);

    switch (method) {
      case "copy":
        navigator.clipboard.writeText(
          `${window.location.origin}/post/${postId}`
        );
        toast.success("Link copied to clipboard");
        break;
      case "send":
        onShare?.("send");
        break;
      case "report":
        if (window.confirm("Report this post?")) {
          toast.success("Post reported");
        }
        break;
      default:
        onShare?.(method);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  return (
    <ActionsContainer>
      <ActionButtons>
        <ActionButton
          onClick={handleLike}
          active={isLiked}
          activeColor="#e41e3f"
          disabled={loading}
        >
          {isLiked ? <FaHeart /> : <FiHeart />}
          {isLiked ? "Liked" : "Like"}
          {likesCount > 0 && <ActionCount>{likesCount}</ActionCount>}
        </ActionButton>

        <ActionButton onClick={onCommentClick}>
          <FiMessageCircle />
          Comment
          {commentsCount > 0 && <ActionCount>{commentsCount}</ActionCount>}
        </ActionButton>

        <ShareMenu>
          <ActionButton onClick={() => setShowShareMenu(!showShareMenu)}>
            <FiShare2 />
            Share
          </ActionButton>

          {showShareMenu && (
            <ShareDropdown>
              <ShareOption onClick={() => handleShare("copy")}>
                <FiCopy />
                Copy Link
              </ShareOption>
              <ShareOption onClick={() => handleShare("send")}>
                <FiSend />
                Send in Message
              </ShareOption>
              <ShareOption onClick={() => handleShare("report")}>
                <FiFlag />
                Report Post
              </ShareOption>
            </ShareDropdown>
          )}
        </ShareMenu>

        <ActionButton
          onClick={handleBookmark}
          active={isBookmarked}
          activeColor="#1877f2"
        >
          <FiBookmark />
          {isBookmarked ? "Saved" : "Save"}
        </ActionButton>
      </ActionButtons>
    </ActionsContainer>
  );
};

export default PostActions;
