import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FormContainer = styled.div`
  background: ${theme.glassmorphism.backgroundColor};
  backdrop-filter: blur(${theme.glassmorphism.blur});
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius};
  border: 1px solid ${theme.glassmorphism.borderColor};
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
  opacity: 0.8;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: rgba(0,0,0,0.2);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  color: ${theme.colors.onSurface};
  font-size: 16px;
  font-family: ${theme.fonts.main};
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

export const Select = styled(Input).attrs({ as: 'select' })``;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, ${theme.colors.primary}, #c392ff);
  color: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 25px ${theme.colors.glow};
  }
  &:disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const TransactionLink = styled.a`
  color: ${theme.colors.secondary};
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

export const GasEstimateContainer = styled.div`
    text-align: right;
    font-size: 14px;
    color: #aaa;
    margin-top: -10px;
    margin-bottom: ${theme.spacing.medium};
    height: 20px;
`;