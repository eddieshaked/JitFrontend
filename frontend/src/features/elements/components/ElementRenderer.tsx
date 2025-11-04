import type { UIElement } from '@shared/types/elements';
import { ElementButton } from './ElementButton';
import { ElementInputField } from './ElementInputField';
import { ElementTextarea } from './ElementTextarea';
import { ElementLabel } from './ElementLabel';

interface ElementRendererProps {
  element: UIElement;
  onClick?: (element: UIElement) => void;
}

export const ElementRenderer = ({ element, onClick }: ElementRendererProps) => {
  switch (element.type) {
    case 'button':
      return <ElementButton element={element} onClick={onClick} />;

    case 'input-text':
    case 'input-email':
    case 'input-password':
    case 'input-number':
      return <ElementInputField element={element} />;

    case 'textarea':
      return <ElementTextarea element={element} />;

    case 'label':
      return <ElementLabel element={element} />;

    default:
      // Fallback for unknown types
      return <ElementButton element={element} onClick={onClick} />;
  }
};

