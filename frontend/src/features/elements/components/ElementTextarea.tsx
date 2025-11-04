import type { UIElement } from '@shared/types/elements';
import styled from 'styled-components';

const FormElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ElementLabel = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
`;

const StyledTextarea = styled.textarea`
  /* Styles come from inline style object */
`;

interface ElementTextareaProps {
  element: UIElement;
}

export const ElementTextarea = ({ element }: ElementTextareaProps) => {
  return (
    <FormElement key={element.id}>
      {element.text && <ElementLabel>{element.text}</ElementLabel>}
      <StyledTextarea
        placeholder={element.placeholder || ''}
        name={element.name || element.text?.toLowerCase()}
        className="generated-textarea"
        rows={4}
        style={element.style as React.CSSProperties}
      />
    </FormElement>
  );
};

