import { useState } from 'react';
import { LoadingSpinner } from '../../shared/components';
import { ElementInput, ElementList, useGenerateElements } from '../../features/elements';
import { PageContainer, PageTitle, Subtitle } from './ElementsPage.styles';

export const ElementsPage = () => {
  const [promptInput, setPromptInput] = useState('');
  const { mutateAsync, data, isPending, error } = useGenerateElements();

  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      return;
    }
    await mutateAsync({ prompt: promptInput });
  };

  return (
    <PageContainer>
      <PageTitle>Button Generator</PageTitle>
      <Subtitle>Create buttons from natural language</Subtitle>

      <ElementInput
        value={promptInput}
        onChange={setPromptInput}
        onSubmit={handleGenerate}
        isLoading={isPending}
        error={error?.message}
      />

      {isPending && <LoadingSpinner text="Generating elements..." />}

      <ElementList elements={data?.elements || []} />
    </PageContainer>
  );
};

