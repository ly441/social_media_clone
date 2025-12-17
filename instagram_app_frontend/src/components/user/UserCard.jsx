import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { followAPI } from "../../services/api";
import { FiUserPlus, FiUserCheck, FiMoreVertical } from "react-icons/fi";



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
