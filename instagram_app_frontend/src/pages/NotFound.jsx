import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiHome, FiSearch, FiMeh } from "react-icons/fi";

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const NotFoundIcon = styled.div`
  font-size: 120px;
  color: #ff6b6b;
  margin-bottom: 24px;
`;

const NotFoundTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #2d3436;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NotFoundSubtitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #636e72;
  margin: 0 0 24px 0;
`;

const NotFoundText = styled.p`
  font-size: 16px;
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const NotFoundCode = styled.code`
  display: block;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  color: #e17055;
  margin-bottom: 32px;
  font-size: 14px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: ${(props) => (props.primary ? "#1877f2" : "#ffffff")};
  color: ${(props) => (props.primary ? "#ffffff" : "#1877f2")};
  border: 2px solid #1877f2;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(24, 119, 242, 0.2);
    background: ${(props) => (props.primary ? "#166fe5" : "#f0f2f5")};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchSection = styled.div`
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #e0e0e0;
`;

const SearchTitle = styled.h3`
  font-size: 18px;
  color: #2d3436;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 2px solid #dfe6e9;
  border-radius: 50px;
  font-size: 16px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #1877f2;
  }
`;

const PopularLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
`;

const PopularLink = styled(Link)`
  padding: 8px 16px;
  background: #f8f9fa;
  color: #636e72;
  text-decoration: none;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #1877f2;
    color: white;
  }
`;

const NotFound = () => {
  const popularLinks = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/profile", label: "Profile" },
    { to: "/messages", label: "Messages" },
    { to: "/events", label: "Events" },
    { to: "/groups", label: "Groups" },
  ];

  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundIcon>
          <FiMeh />
        </NotFoundIcon>

        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>

        <NotFoundText>
          Oops! The page you're looking for seems to have wandered off into the
          digital wilderness. It might have been moved, deleted, or perhaps it
          never existed in the first place.
        </NotFoundText>

        <NotFoundCode>
          Error: 404 Not Found
          <br />
          Path: {window.location.pathname}
          <br />
          Timestamp: {new Date().toISOString()}
        </NotFoundCode>

        <ActionButtons>
          <ActionButton primary to="/">
            <FiHome />
            Back to Home
          </ActionButton>
          <ActionButton to="/explore">
            <FiSearch />
            Explore Content
          </ActionButton>
        </ActionButtons>

        <SearchSection>
          <SearchTitle>Search for something else</SearchTitle>
          <SearchInput
            type="text"
            placeholder="Search posts, people, or topics..."
          />

          <SearchTitle>Popular Pages</SearchTitle>
          <PopularLinks>
            {popularLinks.map((link) => (
              <PopularLink key={link.to} to={link.to}>
                {link.label}
              </PopularLink>
            ))}
          </PopularLinks>
        </SearchSection>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound;
