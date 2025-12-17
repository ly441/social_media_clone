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
