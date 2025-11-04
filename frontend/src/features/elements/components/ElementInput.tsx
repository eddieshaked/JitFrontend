import { useState } from 'react';
import styled from 'styled-components';

const InputSection = styled.div`
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1em;
  transition: border-color 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 120px;

  &:hover:not(:disabled) {
    background: #5568d3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 10px;
  font-size: 0.9em;
  text-align: center;
  padding: 10px;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #ffebee;
`;

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
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && value.trim()) {
      onSubmit();
    }
  };

  return (
    <InputSection>
      <InputGroup>
        <TextInput
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
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

