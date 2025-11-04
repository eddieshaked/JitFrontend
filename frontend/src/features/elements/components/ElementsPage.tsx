import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { UIElement } from '@shared/types/elements';
import { useGenerateElements } from '../hooks/useGenerateElements';
import { ElementInput } from './ElementInput';
import { ElementList } from './ElementList';

const PageContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 100%;
`;

const PageTitle = styled.h1`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 2.5em;
  font-weight: 700;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
  font-size: 1em;
  text-align: center;
`;

export const ElementsPage = () => {
  const [promptInput, setPromptInput] = useState('');
  const [elements, setElements] = useState<UIElement[]>([]);

  const generateElementsMutation = useGenerateElements();

  // Handle successful generation
  useEffect(() => {
    if (generateElementsMutation.data) {
      setElements(generateElementsMutation.data.elements || []);
    }
  }, [generateElementsMutation.data]);

  const handleGenerate = () => {
    if (!promptInput.trim()) {
      return;
    }
    generateElementsMutation.mutate({ prompt: promptInput });
  };

  const handleElementClick = (element: UIElement) => {
    console.log('Element clicked:', element);
  };

  return (
    <PageContainer>
      <PageTitle>Button Generator</PageTitle>
      <Subtitle>Create buttons from natural language</Subtitle>

      <ElementInput
        value={promptInput}
        onChange={setPromptInput}
        onSubmit={handleGenerate}
        isLoading={generateElementsMutation.isPending}
        error={generateElementsMutation.error?.message}
      />

      <ElementList elements={elements} onElementClick={handleElementClick} />
    </PageContainer>
  );
};

