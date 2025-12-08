import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { followAPI } from "../../services/api";
import {
  FiEdit2,
  FiCamera,
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiMoreVertical,
} from "react-icons/fi";

const HeaderContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CoverPhoto = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 8px 0 0;
  margin: -24px -24px 24px;
  position: relative;
`;

const CoverEditButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileImageSection = styled.div`
  position: relative;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ImageEditButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #166fe5;
  }
`;

const ProfileDetails = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1c1e21;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ProfileBio = styled.p`
  font-size: 16px;
  color: #65676b;
  margin: 0 0 16px 0;
  line-height: 1.5;
  max-width: 600px;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #65676b;
  font-size: 14px;
`;

const StatCount = styled.span`
  font-weight: 700;
  color: #1c1e21;
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
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
  }

  &.secondary {
    background: #e4e6eb;
    color: #1c1e21;

    &:hover {
      background: #d8dadf;
    }
  }

  &.success {
    background: #42b72a;
    color: white;

    &:hover {
      background: #36a420;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MoreActions = styled.div`
  position: relative;
`;

const MoreDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
  margin-top: 8px;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #1c1e21;

  &:hover {
    background: #f0f2f5;
  }

  &.danger {
    color: #e41e3f;
  }
`;

const ProfileHeader = ({
  user,
  isOwnProfile,
  isFollowing: initialIsFollowing,
  onEditClick,
  onFollow,
  postCount = 0,
  followerCount = 0,
  followingCount = 0,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await followAPI.follow(user.id);
      setIsFollowing(response.data.following);

      if (onFollow) {
        onFollow(user.id, response.data.following);
      }
    } catch (error) {
      toast.error("Failed to follow user");
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    toast.success("Message feature coming soon!");
  };

  const handleMoreAction = (action) => {
    setShowMoreMenu(false);
    switch (action) {
      case "block":
        if (window.confirm(`Block ${user.username}?`)) {
          toast.success("User blocked");
        }
        break;
      case "report":
        if (window.confirm(`Report ${user.username}?`)) {
          toast.success("User reported");
        }
        break;
      default:
        break;
    }
  };

  return (
    <HeaderContainer>
      <CoverPhoto>
        {isOwnProfile && (
          <CoverEditButton>
            <FiCamera />
            Edit Cover Photo
          </CoverEditButton>
        )}
      </CoverPhoto>

      <ProfileInfo>
        <ProfileImageSection>
          <ProfileImage
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt={user.username}
          />
          {isOwnProfile && (
            <ImageEditButton>
              <FiCamera />
            </ImageEditButton>
          )}
        </ProfileImageSection>

        <ProfileDetails>
          <ProfileName>{user.username}</ProfileName>
          <ProfileBio>{user.bio || "No bio yet"}</ProfileBio>

          <ProfileStats>
            <StatItem>
              <FiUsers />
              <StatCount>{postCount}</StatCount> posts
            </StatItem>
            <StatItem>
              <FiUsers />
              <StatCount>{followerCount}</StatCount> followers
            </StatItem>
            <StatItem>
              <FiUsers />
              <StatCount>{followingCount}</StatCount> following
            </StatItem>
          </ProfileStats>

          <ProfileActions>
            {isOwnProfile ? (
              <>
                <ActionButton className="primary" onClick={onEditClick}>
                  <FiEdit2 />
                  Edit Profile
                </ActionButton>
                <ActionButton className="secondary">Share Profile</ActionButton>
              </>
            ) : (
              <>
                <ActionButton
                  className={isFollowing ? "success" : "primary"}
                  onClick={handleFollow}
                  disabled={loading}
                >
                  {isFollowing ? <FiUserCheck /> : <FiUserPlus />}
                  {isFollowing ? "Following" : "Follow"}
                </ActionButton>
                <ActionButton className="secondary" onClick={handleMessage}>
                  Message
                </ActionButton>
                <MoreActions>
                  <ActionButton
                    className="secondary"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                  >
                    <FiMoreVertical />
                  </ActionButton>

                  {showMoreMenu && (
                    <MoreDropdown>
                      <DropdownItem onClick={() => handleMoreAction("block")}>
                        Block User
                      </DropdownItem>
                      <DropdownItem
                        className="danger"
                        onClick={() => handleMoreAction("report")}
                      >
                        Report User
                      </DropdownItem>
                    </MoreDropdown>
                  )}
                </MoreActions>
              </>
            )}
          </ProfileActions>
        </ProfileDetails>
      </ProfileInfo>
    </HeaderContainer>
  );
};

export default ProfileHeader;
