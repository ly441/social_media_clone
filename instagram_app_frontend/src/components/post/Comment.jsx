import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { commentAPI } from "../../services/api";





const Comment = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOwnComment = comment.user_id === user?.id;

  const handleEdit = async () => {
    if (!editedContent.trim()) return;

    setLoading(true);
    try {
      const response = await commentAPI.update(comment.id, editedContent);
      onUpdate(response.data.comment);
      setIsEditing(false);
      toast.success("Comment updated");
    } catch (error) {
      toast.error("Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await commentAPI.delete(comment.id);
        onDelete(comment.id);
        toast.success("Comment deleted");
      } catch (error) {
        toast.error("Failed to delete comment");
      }
    }
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <CommentAuthor>
          <AuthorAvatar
            src={comment.profile_picture || "https://via.placeholder.com/150"}
            alt={comment.username}
          />
          <AuthorInfo>
            <AuthorName to={`/profile/${comment.user_id}`}>
              {comment.username}
            </AuthorName>
            <CommentTime>{formatTime(comment.created_at)}</CommentTime>
          </AuthorInfo>
        </CommentAuthor>

        {isOwnComment && (
          <CommentMenu>
            <MenuButton onClick={() => setShowMenu(!showMenu)}>
              <FiMoreVertical />
            </MenuButton>

            {showMenu && (
              <MenuDropdown>
                <MenuItem
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                >
                  <FiEdit2 /> Edit
                </MenuItem>
                <MenuItem danger onClick={handleDelete}>
                  <FiTrash2 /> Delete
                </MenuItem>
              </MenuDropdown>
            )}
          </CommentMenu>
        )}
      </CommentHeader>

      {isEditing ? (
        <EditCommentForm
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <EditTextarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            maxLength={500}
            autoFocus
          />
          <EditActions>
            <EditButton
              type="button"
              className="cancel"
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
              }}
              disabled={loading}
            >
              Cancel
            </EditButton>
            <EditButton
              type="submit"
              className="save"
              disabled={!editedContent.trim() || loading}
            >
              {loading ? "Saving..." : "Save"}
            </EditButton>
          </EditActions>
        </EditCommentForm>
      ) : (
        <>
          <CommentContent>
            <CommentText>{comment.content}</CommentText>
          </CommentContent>
          <CommentActions>
            <CommentAction>Like</CommentAction>
            <CommentAction>Reply</CommentAction>
          </CommentActions>
        </>
      )}
    </CommentContainer>
  );
};

export default Comment;
