import { useState } from 'react';
import { VALIDATION } from '../../shared/constants/validation';
import { LoadingSpinner } from '../../shared/components';
import { ElementInput, ElementList, useGenerateElements } from '../../features/elements';
import { PageContainer, PageTitle, Subtitle } from './ElementsPage.styles';

export const ElementsPage = () => {
  const [promptInput, setPromptInput] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const { mutateAsync, data, isPending, error } = useGenerateElements();

  const validatePrompt = (prompt: string): string | undefined => {
    const trimmed = prompt.trim();
    
    if (trimmed.length < VALIDATION.PROMPT.MIN_LENGTH) {
      return 'Prompt cannot be empty';
    }
    
    if (trimmed.length > VALIDATION.PROMPT.MAX_LENGTH) {
      return `Prompt cannot exceed ${VALIDATION.PROMPT.MAX_LENGTH} characters`;
    }
    
    return undefined;
  };

  const handleGenerate = async () => {
    const error = validatePrompt(promptInput);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError(undefined);
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
          error={validationError || error?.message}
        />

      {isPending && <LoadingSpinner text="Generating elements..." />}

      <ElementList elements={data?.elements || []} />
    </PageContainer>
  );
};

