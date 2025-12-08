import React from "react";
import { useAuth } from "../../context/AuthContext";
import { SkeletonLoader } from "../common/Loader";
import styled from "styled-components";

const FeedContainer = styled.div`
  flex: 1;
  max-width: 680px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const FeedHeader = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FeedTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1c1e21;
  margin: 0 0 8px 0;
`;

const FeedSubtitle = styled.p`
  color: #65676b;
  font-size: 14px;
  margin: 0;
`;

const StoriesSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StoriesTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1c1e21;
  margin: 0 0 16px 0;
`;

const StoriesList = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f2f5;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }
`;

const StoryCard = styled.div`
  flex: 0 0 auto;
  width: 120px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StoryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 50%
  );
`;

const StoryContent = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  color: white;
`;

const StoryAuthor = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const AddStoryCard = styled.div`
  flex: 0 0 auto;
  width: 120px;
  height: 200px;
  border-radius: 8px;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #ccc;

  &:hover {
    background: #e4e6eb;
  }
`;

const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #1877f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const AddText = styled.div`
  font-size: 14px;
  color: #1c1e21;
  font-weight: 600;
`;

const SuggestionsSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SuggestionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SuggestionsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1c1e21;
  margin: 0;
`;

const SeeAllButton = styled.button`
  background: none;
  border: none;
  color: #1877f2;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: #f0f2f5;
  }
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

const SuggestionCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const SuggestionImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const SuggestionInfo = styled.div`
  padding: 12px;
`;

const SuggestionName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #1c1e21;
`;

const SuggestionMeta = styled.div`
  font-size: 12px;
  color: #65676b;
  margin-bottom: 12px;
`;

const FollowButton = styled.button`
  width: 100%;
  padding: 8px;
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #166fe5;
  }
`;

const Feed = ({ children, isLoading = false }) => {
  const { user } = useAuth();

  const stories = [
    {
      id: 1,
      username: "John Doe",
      image: "https://via.placeholder.com/120x200/1877f2/fff",
    },
    {
      id: 2,
      username: "Jane Smith",
      image: "https://via.placeholder.com/120x200/e41e3f/fff",
    },
    {
      id: 3,
      username: "Mike Johnson",
      image: "https://via.placeholder.com/120x200/42b72a/fff",
    },
    {
      id: 4,
      username: "Sarah Wilson",
      image: "https://via.placeholder.com/120x200/ffd400/000",
    },
  ];

  const suggestions = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      members: "45K members",
      image: "https://via.placeholder.com/180x120/0077b5/fff",
    },
    {
      id: 2,
      name: "Travel Buddies",
      members: "32K members",
      image: "https://via.placeholder.com/180x120/ff5722/fff",
    },
    {
      id: 3,
      name: "Music Lovers",
      members: "28K members",
      image: "https://via.placeholder.com/180x120/9c27b0/fff",
    },
    {
      id: 4,
      name: "Fitness Community",
      members: "56K members",
      image: "https://via.placeholder.com/180x120/4caf50/fff",
    },
  ];

  if (isLoading) {
    return (
      <FeedContainer>
        <FeedHeader>
          <SkeletonLoader height={32} width="200px" />
          <SkeletonLoader height={16} width="300px" />
        </FeedHeader>
        <StoriesSection>
          <SkeletonLoader height={24} width="150px" />
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader key={i} height={200} width="120px" />
            ))}
          </div>
        </StoriesSection>
        <SuggestionsSection>
          <SkeletonLoader height={28} width="150px" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader key={i} height={180} />
            ))}
          </div>
        </SuggestionsSection>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer>
      <FeedHeader>
        <FeedTitle>Welcome back, {user?.username}!</FeedTitle>
        <FeedSubtitle>Here's what's happening in your network</FeedSubtitle>
      </FeedHeader>

      <StoriesSection>
        <StoriesTitle>Stories</StoriesTitle>
        <StoriesList>
          <AddStoryCard>
            <AddIcon>+</AddIcon>
            <AddText>Add Story</AddText>
          </AddStoryCard>
          {stories.map((story) => (
            <StoryCard key={story.id}>
              <StoryImage src={story.image} alt={story.username} />
              <StoryOverlay />
              <StoryContent>
                <StoryAuthor>{story.username}</StoryAuthor>
              </StoryContent>
            </StoryCard>
          ))}
        </StoriesList>
      </StoriesSection>

      <SuggestionsSection>
        <SuggestionsHeader>
          <SuggestionsTitle>Suggested for you</SuggestionsTitle>
          <SeeAllButton>See All</SeeAllButton>
        </SuggestionsHeader>
        <SuggestionsGrid>
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id}>
              <SuggestionImage src={suggestion.image} alt={suggestion.name} />
              <SuggestionInfo>
                <SuggestionName>{suggestion.name}</SuggestionName>
                <SuggestionMeta>{suggestion.members}</SuggestionMeta>
                <FollowButton>Join Group</FollowButton>
              </SuggestionInfo>
            </SuggestionCard>
          ))}
        </SuggestionsGrid>
      </SuggestionsSection>

      {children}
    </FeedContainer>
  );
};

export default Feed;
