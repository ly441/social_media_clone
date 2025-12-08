import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { FiCamera, FiX } from "react-icons/fi";

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1c1e21;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #1877f2;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1877f2;
  }
`;

const ImageUpload = styled.div`
  margin-bottom: 20px;
`;

const ImagePreview = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
  border: 4px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${ImagePreview}:hover & {
    opacity: 1;
  }
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  color: #1c1e21;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #f0f2f5;
  }
`;

const RemoveImage = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 14px;
  transition: all 0.2s;

  &.primary {
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

  &.secondary {
    background: #e4e6eb;
    color: #1c1e21;

    &:hover {
      background: #d8dadf;
    }
  }
`;

const EditProfile = ({ user, onClose, onUpdate }) => {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    profile_picture: user.profile_picture || "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
        setFormData((prev) => ({
          ...prev,
          profile_picture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setFormData((prev) => ({
      ...prev,
      profile_picture: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim()) {
      toast.error("Username and email are required");
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      onUpdate();
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ImageUpload>
        <ImagePreview>
          <PreviewImage
            src={formData.profile_picture || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <UploadOverlay>
            <UploadButton>
              <FiCamera />
              Change
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </UploadButton>
          </UploadOverlay>
          {(profileImage || formData.profile_picture) && (
            <RemoveImage onClick={removeImage}>
              <FiX />
            </RemoveImage>
          )}
        </ImagePreview>
      </ImageUpload>

      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          maxLength={500}
        />
        <div
          style={{
            fontSize: "12px",
            color: "#65676b",
            textAlign: "right",
            marginTop: "4px",
          }}
        >
          {formData.bio.length}/500
        </div>
      </FormGroup>

      <FormActions>
        <Button
          type="button"
          className="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" className="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </FormActions>
    </Form>
  );
};

export default EditProfile;
