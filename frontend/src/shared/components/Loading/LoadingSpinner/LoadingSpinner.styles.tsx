import styled, { keyframes } from 'styled-components';

export const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Spinner = styled.div<{ size?: number; color?: string }>`
  width: ${({ size = 40 }) => size}px;
  height: ${({ size = 40 }) => size}px;
  border: ${({ size = 40 }) => size * 0.1}px solid
    ${({ color = '#667eea' }) => color}20;
  border-top: ${({ size = 40 }) => size * 0.1}px solid
    ${({ color = '#667eea' }) => color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.p`
  margin-left: 12px;
  color: #666;
  font-size: 0.9em;
`;

