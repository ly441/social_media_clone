import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiMeh } from "react-icons/fi";



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
