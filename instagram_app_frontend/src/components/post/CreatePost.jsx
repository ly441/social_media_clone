import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { postAPI } from "../../services/api";



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
