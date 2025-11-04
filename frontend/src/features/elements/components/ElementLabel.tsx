import type { UIElement } from '@shared/types/elements';
import styled from 'styled-components';

const StyledLabel = styled.label`
  /* Styles come from inline style object */
`;

interface ElementLabelProps {
  element: UIElement;
}

export const ElementLabel = ({ element }: ElementLabelProps) => {
  return (
    <StyledLabel
      key={element.id}
      className="generated-label"
      style={element.style as React.CSSProperties}
    >
      {element.text}
    </StyledLabel>
  );
};

