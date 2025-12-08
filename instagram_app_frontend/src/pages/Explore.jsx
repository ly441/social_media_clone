
import React, { useState, useEffect } from "react";
import { userAPI, postAPI } from "../services/api";
import UserCard from "../components/user/UserCard";
import Post from "../components/post/Post";
import Loader from "../components/common/Loader";
import styled from "styled-components";
import { FiSearch, FiUsers, FiTrendingUp } from "react-icons/fi";

const ExploreContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ExploreHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const ExploreTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1c1e21;
  margin-bottom: 12px;
`;

const ExploreSubtitle = styled.p`
  font-size: 18px;
  color: #65676b;
  max-width: 600px;
  margin: 0 auto 24px;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 40px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 24px 16px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1877f2;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #65676b;
  font-size: 20px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.active ? "#1877f2" : "#65676b")};
  cursor: pointer;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #1877f2;
    opacity: ${(props) => (props.active ? 1 : 0)};
    transition: opacity 0.2s;
  }

  &:hover {
    color: #1877f2;
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1c1e21;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SeeAllButton = styled.button`
  background: none;
  border: none;
  color: #1877f2;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;

  &:hover {
    background: #f0f2f5;
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const TrendingList = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TrendingItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  &:hover {
    background: #f0f2f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TrendingRank = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ccc;
  min-width: 40px;
`;

const TrendingContent = styled.div`
  flex: 1;
`;

const TrendingTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #1c1e21;
`;

const TrendingMeta = styled.div`
  font-size: 14px;
  color: #65676b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #65676b;
`;

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