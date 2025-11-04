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

const StyledInput = styled.input`
  /* Styles come from inline style object */
`;

interface ElementInputFieldProps {
  element: UIElement;
}

export const ElementInputField = ({ element }: ElementInputFieldProps) => {
  const inputType = element.type.replace('input-', '');

  return (
    <FormElement key={element.id}>
      {element.text && <ElementLabel>{element.text}</ElementLabel>}
      <StyledInput
        type={inputType}
        placeholder={element.placeholder || ''}
        name={element.name || element.text?.toLowerCase()}
        className="generated-input"
        style={element.style as React.CSSProperties}
      />
    </FormElement>
  );
};

