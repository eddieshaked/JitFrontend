import {
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
  return (
    <InputSection>
      <InputGroup>
        <TextInput
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <SubmitButton onClick={onSubmit} disabled={isLoading || !value.trim()}>
          {isLoading ? 'Generating...' : 'Generate'}
        </SubmitButton>
      </InputGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputSection>
  );
};

