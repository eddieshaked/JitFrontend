import type { HTMLElement } from '@shared/types/elements';

interface HTMLElementRendererProps {
  element: HTMLElement;
}

export const HTMLElementRenderer = ({ element }: HTMLElementRendererProps) => {
  return (
    <div
      key={element.id}
      dangerouslySetInnerHTML={{ __html: element.html }}
    />
  );
};

