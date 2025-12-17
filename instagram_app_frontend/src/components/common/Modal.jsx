import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { FiX } from "react-icons/fi";



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
