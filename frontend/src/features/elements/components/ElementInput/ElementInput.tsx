import { VALIDATION } from '../../../../shared/constants/validation';
import {
  CharacterCount,
  ErrorMessage,
  InputGroup,
  InputSection,
  SubmitButton,
  TextInput,
} from './ElementInput.styles';

interface ElementInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
  placeholder?: string;
}

export const ElementInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
  placeholder = 'e.g., create a blue button',
}: ElementInputProps) => {
  const maxLength = VALIDATION.PROMPT.MAX_LENGTH;
  const currentLength = value.length;
  const isMaxLength = currentLength >= maxLength;
  const isValidLength = currentLength >= VALIDATION.PROMPT.MIN_LENGTH && currentLength <= maxLength;
  const canSubmit = !isLoading && isValidLength && value.trim().length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Enforce max length on frontend
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <InputSection>
      <InputGroup>
        <TextInput
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          maxLength={maxLength}
          aria-label="Prompt input for generating UI elements"
        />
        <SubmitButton onClick={onSubmit} disabled={!canSubmit}>
          {isLoading ? 'Generating...' : 'Generate'}
        </SubmitButton>
      </InputGroup>
      <CharacterCount $isMaxLength={isMaxLength}>
        {currentLength}/{maxLength}
      </CharacterCount>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputSection>
  );
};

