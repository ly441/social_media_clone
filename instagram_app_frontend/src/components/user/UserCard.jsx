import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { followAPI } from "../../services/api";
import { FiUserPlus, FiUserCheck, FiMoreVertical } from "react-icons/fi";

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div``;

const Username = styled(Link)`
  font-weight: 600;
  color: #1c1e21;
  text-decoration: none;
  font-size: 16px;
  display: block;
  margin-bottom: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const UserMeta = styled.div`
  font-size: 13px;
  color: #65676b;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #65676b;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background: #f0f2f5;
  }
`;

const CardBody = styled.div`
  margin-bottom: 16px;
`;

const UserBio = styled.p`
  font-size: 14px;
  color: #1c1e21;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  gap: 8px;
`;

const FollowButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  font-size: 14px;

  &.follow {
    background: #1877f2;
    color: white;

    &:hover {
      background: #166fe5;
    }
  }

  &.following {
    background: #e4e6eb;
    color: #1c1e21;

    &:hover {
      background: #d8dadf;
    }
  }
`;

const MessageButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  background: #e4e6eb;
  color: #1c1e21;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #d8dadf;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 8px;
  background: #f0f2f5;
  border-radius: 6px;
`;

const StatValue = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: #1877f2;
  margin-bottom: 2px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #65676b;
`;

const UserCard = ({
  user,
  isFollowing: initialIsFollowing,
  onFollowChange,
}) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const isOwnProfile = user.id === currentUser?.id;

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await followAPI.follow(user.id);
      setIsFollowing(response.data.following);

      if (onFollowChange) {
        onFollowChange(user.id, response.data.following);
      }

      toast.success(
        response.data.following
          ? "Followed successfully"
          : "Unfollowed successfully"
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to follow user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContainer>
      <CardHeader>
        <UserInfo>
          <UserAvatar
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt={user.username}
          />
          <UserDetails>
            <Username to={`/profile/${user.id}`}>{user.username}</Username>
            <UserMeta>
              {user.post_count} posts • {user.follower_count} followers
            </UserMeta>
          </UserDetails>
        </UserInfo>

        <MenuButton>
          <FiMoreVertical />
        </MenuButton>
      </CardHeader>

      <CardBody>
        <UserBio>{user.bio || "No bio yet"}</UserBio>
      </CardBody>

      {!isOwnProfile && (
        <CardFooter>
          <FollowButton
            className={isFollowing ? "following" : "follow"}
            onClick={handleFollow}
            disabled={loading}
          >
            {isFollowing ? (
              <>
                <FiUserCheck />
                Following
              </>
            ) : (
              <>
                <FiUserPlus />
                Follow
              </>
            )}
          </FollowButton>
          <MessageButton>Message</MessageButton>
        </CardFooter>
      )}

      {isOwnProfile && (
        <StatsGrid>
          <StatItem>
            <StatValue>{user.post_count}</StatValue>
            <StatLabel>Posts</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{user.follower_count}</StatValue>
            <StatLabel>Followers</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{user.following_count}</StatValue>
            <StatLabel>Following</StatLabel>
          </StatItem>
        </StatsGrid>
      )}
    </CardContainer>
  );
};

export default UserCard;
