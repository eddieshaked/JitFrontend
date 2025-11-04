import { LoadingText, Spinner, SpinnerContainer } from './LoadingSpinner.styles';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
}

export const LoadingSpinner = ({
  size = 40,
  color = '#667eea',
  text,
}: LoadingSpinnerProps) => {
  return (
    <SpinnerContainer>
      <Spinner size={size} color={color} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
};

