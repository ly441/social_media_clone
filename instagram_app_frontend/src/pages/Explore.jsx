import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
      const res = await userAPI.search("");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchPosts = async () => {
    setLoading((prev) => ({ ...prev, posts: true }));
    try {
      const res = await postAPI.getAll();
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }));
    }
  };

  const fetchTrending = async () => {
    setLoading((prev) => ({ ...prev, trending: true }));
    setTrending([
      { id: 1, title: "SocialMedia", posts: "2.5K posts" },
      { id: 2, title: "ReactJS", posts: "1.8K posts" },
      { id: 3, title: "WebDevelopment", posts: "3.2K posts" },
      { id: 4, title: "AI", posts: "4.1K posts" },
      { id: 5, title: "TechNews", posts: "1.5K posts" },
    ]);
    setLoading((prev) => ({ ...prev, trending: false }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await userAPI.search(searchQuery);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "posts" && posts.length === 0) fetchPosts();
  };

  return (
    <ExploreContainer>
      <ExploreHeader>
        <ExploreTitle>Explore</ExploreTitle>
        <ExploreSubtitle>
          Discover people, posts, and trending topics
        </ExploreSubtitle>

        <SearchContainer>
          <FiSearch />
          <form onSubmit={handleSearch}>
            <SearchInput
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
        {activeTab === "users" &&
          (loading.users ? (
            <Loader />
          ) : (
            <UsersGrid>
              {users.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </UsersGrid>
          ))}

        {activeTab === "posts" &&
          (loading.posts ? (
            <Loader />
          ) : (
            <PostsGrid>
              {posts.map((p) => (
                <Post key={p.id} post={p} />
              ))}
            </PostsGrid>
          ))}

        {activeTab === "trending" &&
          (loading.trending ? (
            <Loader />
          ) : (
            <TrendingList>
              {trending.map((item, i) => (
                <TrendingItem key={item.id}>
                  <span>#{i + 1}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.posts}</small>
                  </div>
                </TrendingItem>
              ))}
            </TrendingList>
          ))}
      </TabContent>
    </ExploreContainer>
  );
};

export default Explore;

/* ================= STYLES ================= */

const ExploreContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
`;

const ExploreHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ExploreTitle = styled.h1`
  font-size: 28px;
`;

const ExploreSubtitle = styled.p`
  color: #666;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background: ${(props) => (props.active ? "#2563eb" : "#eee")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
`;

const TabContent = styled.div``;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TrendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrendingItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: black;
`;
