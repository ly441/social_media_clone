import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { postAPI, commentAPI } from "../../services/api";
import toast from "react-hot-toast";
import moment from "moment";
import styled from "styled-components";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import CommentSection from "./CommentSection";

const PostContainer = styled.div`
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled(Link)`
  font-weight: 600;
  color: #1c1e21;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PostTime = styled.span`
  font-size: 12px;
  color: #65676b;
`;

const PostMenu = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #65676b;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;

  &:hover {
    background: #f0f2f5;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 100;
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${(props) => (props.danger ? "#e41e3f" : "#1c1e21")};

  &:hover {
    background: #f0f2f5;
  }
`;

const PostContent = styled.div`
  padding: 0 16px 16px;
`;

const PostText = styled.p`
  margin-bottom: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
`;

const PostStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  color: #65676b;
  font-size: 14px;
  padding: 10px 0;
`;

const PostActions = styled.div`
  display: flex;
  padding: 8px 0;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 8px;
  color: ${(props) => (props.active ? "#e41e3f" : "#65676b")};
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;

  &:hover {
    background: #f0f2f5;
  }
`;

const Post = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const response = await postAPI.like(post.id);
      setLiked(response.data.liked);
      setLikesCount(response.data.likes_count);
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postAPI.delete(post.id);
        onDelete(post.id);
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  return (
    <PostContainer>
      <PostHeader>
        <UserInfo>
          <UserAvatar
            src={post.profile_picture || "https://via.placeholder.com/150"}
            alt={post.username}
          />
          <UserDetails>
            <Username to={`/profile/${post.user_id}`}>{post.username}</Username>
            <PostTime>{formatTime(post.created_at)}</PostTime>
          </UserDetails>
        </UserInfo>

        {post.user_id === user?.id && (
          <PostMenu>
            <MenuButton onClick={() => setShowMenu(!showMenu)}>
              <FiMoreVertical />
            </MenuButton>

            {showMenu && (
              <MenuDropdown>
                <MenuItem>
                  <FiEdit2 /> Edit Post
                </MenuItem>
                <MenuItem danger onClick={handleDelete}>
                  <FiTrash2 /> Delete Post
                </MenuItem>
              </MenuDropdown>
            )}
          </PostMenu>
        )}
      </PostHeader>

      <PostContent>
        <PostText>{post.content}</PostText>
        {post.image_url && <PostImage src={post.image_url} alt="Post" />}
      </PostContent>

      <PostStats>
        <span>{likesCount} likes</span>
        <span>{post.comments_count} comments</span>
      </PostStats>

      <PostActions>
        <ActionButton active={liked} onClick={handleLike}>
          {liked ? <FaHeart /> : <FiHeart />}
          {liked ? "Liked" : "Like"}
        </ActionButton>

        <ActionButton onClick={() => setShowComments(!showComments)}>
          <FiMessageCircle />
          Comment
        </ActionButton>

        <ActionButton>
          <FiShare2 />
          Share
        </ActionButton>
      </PostActions>

      {showComments && <CommentSection postId={post.id} />}
    </PostContainer>
  );
};

export default Post;
