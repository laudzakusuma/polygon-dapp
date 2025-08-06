import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const NotificationContainer = styled.div<{ type: 'success' | 'error' }>`
  padding: ${theme.spacing.medium};
  border-radius: ${theme.borderRadius};
  margin-bottom: ${theme.spacing.medium};
  color: ${theme.colors.onPrimary};
  background-color: ${(props) => (props.type === 'success' ? theme.colors.secondary : theme.colors.error)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.onPrimary};
  font-size: 20px;
  cursor: pointer;
  margin-left: ${theme.spacing.medium};
`;

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <NotificationContainer type={type}>
      <span>{message}</span>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </NotificationContainer>
  );
};