import React, { useState } from "react";
import styled from "styled-components";
import { FiImage, FiSmile, FiMapPin } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { postAPI } from "../../services/api";
import { toast } from "react-toastify";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    try {
      const postData = {
        content: content.trim(),
        image_url: image ? URL.createObjectURL(image) : null,
      };

      const response = await postAPI.create(postData);
      onPostCreated(response.data.post);
      setContent("");
      setImage(null);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(file);
    }
  };

  return (
    <CreatePostContainer>
      <PostHeader>
        <UserAvatar
          src={user?.profile_picture || "https://via.placeholder.com/150"}
          alt={user?.username}
        />
        <TextArea
          placeholder={`What's on your mind, ${user?.username}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
      </PostHeader>

      {image && (
        <ImagePreview>
          <PreviewImage src={URL.createObjectURL(image)} alt="Preview" />
          <RemoveImage onClick={() => setImage(null)}>×</RemoveImage>
        </ImagePreview>
      )}

      <PostActions>
        <ActionButtons>
          <ActionButton as="label" htmlFor="image-upload">
            <FiImage />
            Photo
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </ActionButton>

          <ActionButton>
            <FiSmile />
            Feeling
          </ActionButton>

          <ActionButton>
            <FiMapPin />
            Check in
          </ActionButton>
        </ActionButtons>

        <SubmitButton
          onClick={handleSubmit}
          disabled={(!content.trim() && !image) || loading}
        >
          {loading ? "Posting..." : "Post"}
        </SubmitButton>
      </PostActions>
    </CreatePostContainer>
  );
};

export default CreatePost;

/* Styled Components */
const CreatePostContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PostHeader = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const UserAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  resize: none;
  font-size: 14px;
`;

const ImagePreview = styled.div`
  position: relative;
  margin: 10px 0;
`;

const PreviewImage = styled.img`
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const RemoveImage = styled.span`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 2px 6px;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: #f0f2f5;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #e4e6eb;
  }
`;

const SubmitButton = styled.button`
  background: #1877f2;
  color: #fff;
  border: none;
  padding: 7px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
