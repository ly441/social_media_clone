import React, { useState, useEffect } from "react";
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
    if (targetUserId) {
      fetchProfileData();
    }
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
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followAPI.follow(targetUserId);
      fetchProfileData(); // Refresh data
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleProfileUpdate = () => {
    setShowEditModal(false);
    fetchProfileData();
  };

  if (loading) {
    return <Loader />;
  }

  if (!profileUser) {
    return <div>User not found</div>;
  }

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
        <ProfileSidebar>
          <Section>
            <SectionTitle>About</SectionTitle>
            <InfoItem>
              <InfoLabel>Bio:</InfoLabel>
              <InfoValue>{profileUser.bio || "No bio yet"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Joined:</InfoLabel>
              <InfoValue>
                {new Date(profileUser.created_at).toLocaleDateString()}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{profileUser.email}</InfoValue>
            </InfoItem>
          </Section>

          <Section>
            <SectionTitle>Followers ({followers.length})</SectionTitle>
            <div>
              {followers.slice(0, 5).map((follower) => (
                <div key={follower.user.id} style={{ marginBottom: "8px" }}>
                  {follower.user.username}
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <SectionTitle>Following ({following.length})</SectionTitle>
            <div>
              {following.slice(0, 5).map((follow) => (
                <div key={follow.user.id} style={{ marginBottom: "8px" }}>
                  {follow.user.username}
                </div>
              ))}
            </div>
          </Section>
        </ProfileSidebar>

        <ProfileMain>
          <Section>
            <SectionTitle>Posts ({posts.length})</SectionTitle>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post.id} post={post} onDelete={fetchProfileData} />
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </Section>
        </ProfileMain>
      </ProfileContent>

      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </ProfileContainer>
  );
};

export default Profile;
