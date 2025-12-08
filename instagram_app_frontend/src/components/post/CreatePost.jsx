import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { postAPI } from "../../services/api";

const CreatePostContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  font-size: 16px;
  line-height: 1.5;
  min-height: 60px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #65676b;
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #65676b;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;

  &:hover {
    background: #f0f2f5;
  }
`;

const SubmitButton = styled.button`
  background: ${(props) => (props.disabled ? "#ccc" : "#1877f2")};
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    background: #166fe5;
  }
`;

const ImagePreview = styled.div`
  margin-top: 16px;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
`;

const RemoveImage = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

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
        // 5MB limit
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
