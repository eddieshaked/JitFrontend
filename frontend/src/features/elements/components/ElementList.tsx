import type { UIElement } from '@shared/types/elements';
import styled from 'styled-components';
import { ElementRenderer } from './ElementRenderer';

const ElementsSection = styled.section`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #f0f0f0;
`;

const SectionTitle = styled.h2`
  margin: 0 0 25px 0;
  color: #333;
  font-size: 1.8em;
  text-align: center;
`;

const ElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
`;

interface ElementListProps {
  elements: UIElement[];
  onElementClick?: (element: UIElement) => void;
}

export const ElementList = ({ elements, onElementClick }: ElementListProps) => {
  if (elements.length === 0) {
    return null;
  }

  return (
    <ElementsSection>
      <SectionTitle>Generated Elements</SectionTitle>
      <ElementsContainer>
        {elements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            onClick={onElementClick}
          />
        ))}
      </ElementsContainer>
    </ElementsSection>
  );
};

