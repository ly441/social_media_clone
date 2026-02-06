import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { userAPI, followAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/user/ProfileHeader";
import EditProfileModal from "../components/user/EditProfile";
import Post from "../components/post/Post";
import Loader from "../components/common/Loader";

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;
  const targetUserId = userId || currentUser?.id;

  useEffect(() => {
    if (targetUserId) fetchProfileData();
  }, [targetUserId]);

  const fetchProfileData = async () => {
    try {
      const [
        userResponse,
        postsResponse,
        followersResponse,
        followingResponse,
      ] = await Promise.all([
        userAPI.getById(targetUserId),
        userAPI.getPosts(targetUserId),
        followAPI.getFollowers(targetUserId),
        followAPI.getFollowing(targetUserId),
      ]);

      setProfileUser(userResponse.data.user);
      setPosts(postsResponse.data.posts);
      setFollowers(followersResponse.data.followers);
      setFollowing(followingResponse.data.following);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followAPI.follow(targetUserId);
      fetchProfileData();
    } catch (err) {
      console.error("Follow failed:", err);
    }
  };

  if (loading) return <Loader />;
  if (!profileUser) return <p>User not found</p>;

  return (
    <ProfileContainer>
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        onEditClick={() => setShowEditModal(true)}
        onFollow={handleFollow}
        postCount={posts.length}
        followerCount={followers.length}
        followingCount={following.length}
      />

      <ProfileContent>
        <Sidebar>
          <Card>
            <Title>About</Title>
            <Info>{profileUser.bio || "No bio yet"}</Info>
            <Info>Email: {profileUser.email}</Info>
            <Info>
              Joined: {new Date(profileUser.created_at).toLocaleDateString()}
            </Info>
          </Card>

          <Card>
            <Title>Followers ({followers.length})</Title>
            {followers.slice(0, 5).map((f) => (
              <SmallText key={f.user.id}>{f.user.username}</SmallText>
            ))}
          </Card>

          <Card>
            <Title>Following ({following.length})</Title>
            {following.slice(0, 5).map((f) => (
              <SmallText key={f.user.id}>{f.user.username}</SmallText>
            ))}
          </Card>
        </Sidebar>

        <Main>
          <Title>Posts ({posts.length})</Title>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post.id} post={post} onDelete={fetchProfileData} />
            ))
          ) : (
            <SmallText>No posts yet</SmallText>
          )}
        </Main>
      </ProfileContent>

      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchProfileData}
        />
      )}
    </ProfileContainer>
  );
};

export default Profile;

/* ================= STYLES ================= */

const ProfileContainer = styled.div`
  max-width: 1100px;
  margin: auto;
  padding: 20px;
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Card = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
`;

const Title = styled.h3`
  margin-bottom: 8px;
`;

const Info = styled.p`
  font-size: 14px;
  color: #555;
`;

const SmallText = styled.p`
  font-size: 13px;
  color: #666;
`;
