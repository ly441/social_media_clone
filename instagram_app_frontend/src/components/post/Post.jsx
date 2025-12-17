import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { postAPI, commentAPI } from "../../services/api";
import Comment from "././Comment";



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
