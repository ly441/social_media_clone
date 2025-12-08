import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1877f2;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoaderText = styled.p`
  margin-top: 10px;
  color: #65676b;
  font-size: 14px;
`;

export const Loader = ({ text = "Loading..." }) => (
  <LoaderContainer>
    <div style={{ textAlign: "center" }}>
      <Spinner />
      {text && <LoaderText>{text}</LoaderText>}
    </div>
  </LoaderContainer>
);

export const SkeletonLoader = ({
  count = 1,
  height = 20,
  width = "100%",
  className = "",
}) => {
  const Skeleton = styled.div`
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 8px;

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          style={{ height: `${height}px`, width }}
          className={className}
        />
      ))}
    </>
  );
};

export default Loader;
