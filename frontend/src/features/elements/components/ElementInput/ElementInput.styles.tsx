import styled from 'styled-components';

export const InputSection = styled.div`
  margin-bottom: 30px;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
`;

export const TextInput = styled.input`
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

export const SubmitButton = styled.button`
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

export const CharacterCount = styled.span<{ $isMaxLength: boolean }>`
  display: block;
  text-align: right;
  font-size: 0.85em;
  color: ${({ $isMaxLength }) => ($isMaxLength ? '#dc3545' : '#666')};
  margin-top: 5px;
  margin-bottom: 10px;
  font-weight: ${({ $isMaxLength }) => ($isMaxLength ? '600' : '400')};
`;

export const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 10px;
  font-size: 0.9em;
  text-align: center;
  padding: 10px;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #ffebee;
`;

