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
