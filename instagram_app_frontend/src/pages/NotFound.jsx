import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiMeh } from "react-icons/fi";

const NotFound = () => {
  return (
    <Container>
      <Icon>
        <FiMeh />
      </Icon>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>

      <Text>The page you’re looking for doesn’t exist or has been moved.</Text>

      <Buttons>
        <Btn to="/">
          <FiHome /> Home
        </Btn>
        <Btn to="/explore">
          <FiSearch /> Explore
        </Btn>
      </Buttons>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 60px;
  color: #999;
`;

const Title = styled.h1`
  font-size: 80px;
`;

const Subtitle = styled.h2`
  color: #444;
`;

const Text = styled.p`
  color: #666;
  max-width: 400px;
`;

const Buttons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 15px;
`;

const Btn = styled(Link)`
  padding: 10px 20px;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  text-decoration: none;
`;
