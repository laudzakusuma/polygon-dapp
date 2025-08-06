import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const SkeletonBase = styled.div`
  background: #2a2a3a;
  background-image: linear-gradient(to right, #2a2a3a 0%, #3a3a4a 20%, #2a2a3a 40%, #2a2a3a 100%);
  background-repeat: no-repeat;
  background-size: 2000px 104px;
  display: inline-block;
  position: relative;
  animation: ${shimmer} 2s infinite;
  border-radius: ${(props) => props.theme.borderRadius};
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 150px;
`;

export const SkeletonText = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '1em'};
  margin-bottom: 0.5em;
`;

export const SkeletonGrid: React.FC<{ count: number; type: 'token' | 'nft' }> = ({ count, type }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        type === 'token' ? <SkeletonCard key={index} /> : <SkeletonCard style={{height: '280px'}} key={index} />
      ))}
    </>
  );
};