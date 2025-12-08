import React, { useState, useEffect } from "react";
import { postAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CreatePost from "../components/post/CreatePost";
import Post from "../components/post/Post";
import Loader from "../components/common/Loader";


const HomeContainer = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 20px;
`;

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      const response = await postAPI.getAll(pageNum);
      const newPosts = response.data.posts;

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(response.data.pages > pageNum);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchPosts(page + 1);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  if (loading && posts.length === 0) {
    return <Loader />;
  }

  return (
    <HomeContainer>
      <CreatePost onPostCreated={handlePostCreated} />

      <InfiniteScroll
        dataLength={posts.length}
        next={handleLoadMore}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={
          <p style={{ textAlign: "center", padding: "20px" }}>
            No more posts to show
          </p>
        }
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} onDelete={handlePostDelete} />
        ))}
      </InfiniteScroll>
    </HomeContainer>
  );
};

export default Home;
