import type { UIElement } from '@shared/types/elements';
import styled from 'styled-components';

const StyledButton = styled.button`
  /* Styles come from inline style object */
`;

interface ElementButtonProps {
  element: UIElement;
  onClick?: (element: UIElement) => void;
}

export const ElementButton = ({ element, onClick }: ElementButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(element);
    }
    if (element.onClick) {
      alert(`Action: ${element.onClick}`);
    }
  };

  return (
    <StyledButton
      key={element.id}
      onClick={handleClick}
      className="generated-button"
      style={element.style as React.CSSProperties}
    >
      {element.text}
    </StyledButton>
  );
};

