import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FormContainer = styled.div`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius};
  border: 1px solid ${theme.colors.border};
  max-width: 500px;
  margin: 0 auto;
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.medium};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.small};
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  color: ${theme.colors.onSurface};
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

export const Select = styled(Input).attrs({ as: 'select' })``;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryVariant};
  }
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

export const TransactionLink = styled.a`
  color: ${theme.colors.secondary};
  text-decoration: underline;
  font-weight: bold;
`;

export const GasEstimateContainer = styled.div`
    text-align: right;
    font-size: 14px;
    color: #aaa;
    margin-top: -10px;
    margin-bottom: ${theme.spacing.medium};
    height: 20px; // Beri tinggi agar layout tidak bergeser
`;