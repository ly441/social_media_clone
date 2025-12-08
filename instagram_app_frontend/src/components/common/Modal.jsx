import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: ${(props) =>
    props.size === "sm" ? "400px" : props.size === "lg" ? "800px" : "600px"};
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1c1e21;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #65676b;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background: #f0f2f5;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  max-height: calc(90vh - 140px);
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ModalButton = styled.button`
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &.primary {
    background: #1877f2;
    color: white;

    &:hover {
      background: #166fe5;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: #e4e6eb;
    color: #1c1e21;

    &:hover {
      background: #d8dadf;
    }
  }

  &.danger {
    background: #e41e3f;
    color: white;

    &:hover {
      background: #c91e39;
    }
  }
`;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showFooter = true,
  primaryButtonText = "Save",
  secondaryButtonText = "Cancel",
  onPrimaryClick,
  onSecondaryClick,
  isLoading = false,
  disablePrimary = false,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent size={size}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {showCloseButton && (
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          )}
        </ModalHeader>

        <ModalBody>{children}</ModalBody>

        {showFooter && (
          <ModalFooter>
            <ModalButton
              className="secondary"
              onClick={handleSecondaryClick}
              disabled={isLoading}
            >
              {secondaryButtonText}
            </ModalButton>
            <ModalButton
              className="primary"
              onClick={handlePrimaryClick}
              disabled={disablePrimary || isLoading}
            >
              {isLoading ? "Loading..." : primaryButtonText}
            </ModalButton>
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>,
    document.getElementById("modal-root")
  );
};

export default Modal;
