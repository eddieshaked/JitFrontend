import type { HTMLElement } from '@shared/types/elements';
import {
  ElementsContainer,
  ElementsSection,
  SectionTitle,
} from './ElementList.styles';
import { HTMLElementRenderer } from '../HTMLElementRenderer';

interface ElementListProps {
  elements: HTMLElement[];
}

export const ElementList = ({ elements }: ElementListProps) => {
  if (elements.length === 0) {
    return null;
  }

  return (
    <ElementsSection>
      <SectionTitle>Generated Elements</SectionTitle>
      <ElementsContainer>
        {elements.map((element) => (
          <HTMLElementRenderer key={element.id} element={element} />
        ))}
      </ElementsContainer>
    </ElementsSection>
  );
};

