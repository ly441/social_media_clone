import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { FiCamera, FiX } from "react-icons/fi";



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
