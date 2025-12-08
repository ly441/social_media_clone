import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { commentAPI } from "../../services/api";
import toast from "react-hot-toast";
import moment from "moment";
import styled from "styled-components";
import { FiEdit2, FiTrash2, FiMoreVertical } from "react-icons/fi";

const CommentContainer = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled(Link)`
  font-weight: 600;
  color: #1c1e21;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const CommentTime = styled.div`
  font-size: 12px;
  color: #65676b;
  margin-top: 2px;
`;

const CommentMenu = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #65676b;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  font-size: 16px;

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
  min-width: 120px;
  z-index: 100;
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.danger ? "#e41e3f" : "#1c1e21")};

  &:hover {
    background: #f0f2f5;
  }
`;

const CommentContent = styled.div`
  margin-left: 40px;
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #1c1e21;
  white-space: pre-wrap;
`;

const EditCommentForm = styled.form`
  margin-left: 40px;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1877f2;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const EditButton = styled.button`
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 14px;

  &.save {
    background: #1877f2;
    color: white;

    &:hover {
      background: #166fe5;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }

  &.cancel {
    background: #e4e6eb;
    color: #1c1e21;

    &:hover {
      background: #d8dadf;
    }
  }
`;

const CommentActions = styled.div`
  display: flex;
  gap: 16px;
  margin-left: 40px;
  margin-top: 8px;
`;

const CommentAction = styled.button`
  background: none;
  border: none;
  color: #65676b;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;

  &:hover {
    color: #1877f2;
  }
`;

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
