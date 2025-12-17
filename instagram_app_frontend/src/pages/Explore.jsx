
import React, { useState, useEffect } from "react";
import { userAPI, postAPI } from "../services/api";
import UserCard from "../components/user/UserCard";
import Post from "../components/post/Post";
import Loader from "../components/common/Loader";
import { FiSearch, FiUsers, FiTrendingUp } from "react-icons/fi";



const Explore = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    posts: false,
    trending: false,
  });

  useEffect(() => {
    fetchTrending();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const response = await userAPI.search("");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchPosts = async () => {
    setLoading((prev) => ({ ...prev, posts: true }));
    try {
      const response = await postAPI.getAll();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }));
    }
  };

  const fetchTrending = async () => {
    setLoading((prev) => ({ ...prev, trending: true }));
    try {
      // Mock trending data
      const mockTrending = [
        { id: 1, title: "#SocialMedia", posts: "2.5K posts" },
        { id: 2, title: "#ReactJS", posts: "1.8K posts" },
        { id: 3, title: "#WebDevelopment", posts: "3.2K posts" },
        { id: 4, title: "#AI", posts: "4.1K posts" },
        { id: 5, title: "#TechNews", posts: "1.5K posts" },
      ];
      setTrending(mockTrending);
    } catch (error) {
      console.error("Failed to fetch trending:", error);
    } finally {
      setLoading((prev) => ({ ...prev, trending: false }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await userAPI.search(searchQuery);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "posts" && posts.length === 0) {
      fetchPosts();
    }
  };

  const handleFollowChange = (userId, isFollowing) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, is_following: isFollowing } : user
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const renderUsersTab = () => (
    <Section>
      <SectionHeader>
        <SectionTitle>
          <FiUsers />
          Discover People
        </SectionTitle>
        <SeeAllButton>View All</SeeAllButton>
      </SectionHeader>

      {loading.users ? (
        <Loader text="Loading users..." />
      ) : users.length > 0 ? (
        <UsersGrid>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onFollowChange={handleFollowChange}
            />
          ))}
        </UsersGrid>
      ) : (
        <EmptyState>
          <h3>No users found</h3>
          <p>Try a different search term</p>
        </EmptyState>
      )}
    </Section>
  );

  const renderPostsTab = () => (
    <Section>
      <SectionHeader>
        <SectionTitle>Popular Posts</SectionTitle>
        <SeeAllButton>View All</SeeAllButton>
      </SectionHeader>

      {loading.posts ? (
        <Loader text="Loading posts..." />
      ) : posts.length > 0 ? (
        <PostsGrid>
          {posts.map((post) => (
            <Post key={post.id} post={post} onDelete={handlePostDelete} />
          ))}
        </PostsGrid>
      ) : (
        <EmptyState>
          <h3>No posts found</h3>
          <p>Be the first to create a post!</p>
        </EmptyState>
      )}
    </Section>
  );

  const renderTrendingTab = () => (
    <Section>
      <SectionHeader>
        <SectionTitle>
          <FiTrendingUp />
          Trending Now
        </SectionTitle>
        <SeeAllButton>View All</SeeAllButton>
      </SectionHeader>

      {loading.trending ? (
        <Loader text="Loading trending topics..." />
      ) : trending.length > 0 ? (
        <TrendingList>
          {trending.map((item, index) => (
            <TrendingItem key={item.id}>
              <TrendingRank>#{index + 1}</TrendingRank>
              <TrendingContent>
                <TrendingTitle>{item.title}</TrendingTitle>
                <TrendingMeta>{item.posts}</TrendingMeta>
              </TrendingContent>
            </TrendingItem>
          ))}
        </TrendingList>
      ) : (
        <EmptyState>
          <h3>No trending topics</h3>
          <p>Check back later for trending topics</p>
        </EmptyState>
      )}
    </Section>
  );

  return (
    <ExploreContainer>
      <ExploreHeader>
        <ExploreTitle>Explore</ExploreTitle>
        <ExploreSubtitle>
          Discover people, posts, and trending topics from around the world
        </ExploreSubtitle>

        <SearchContainer>
          <SearchIcon />
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search users, posts, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>
      </ExploreHeader>

      <Tabs>
        <Tab
          active={activeTab === "users"}
          onClick={() => handleTabChange("users")}
        >
          People
        </Tab>
        <Tab
          active={activeTab === "posts"}
          onClick={() => handleTabChange("posts")}
        >
          Posts
        </Tab>
        <Tab
          active={activeTab === "trending"}
          onClick={() => handleTabChange("trending")}
        >
          Trending
        </Tab>
      </Tabs>

      <TabContent>
        {activeTab === "users" && renderUsersTab()}
        {activeTab === "posts" && renderPostsTab()}
        {activeTab === "trending" && renderTrendingTab()}
      </TabContent>
    </ExploreContainer>
  );
};

export default Explore;