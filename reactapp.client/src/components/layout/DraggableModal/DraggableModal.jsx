import "./draggable.window.css"

import React, { useCallback, useEffect, useRef, useState } from 'react';

const DraggableModal = ({ isVisible, onClose, children, headerText=null }) => {
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const centerModal = useCallback(() => {
    if (modalRef.current) {
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      const newX = (window.innerWidth - modalWidth) / 2;
      const newY = (window.innerHeight - modalHeight) / 2;
      setPosition({ x: newX, y: newY });
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      centerModal();
    }
  }, [isVisible, centerModal]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        <div className="modal-header" onMouseDown={handleMouseDown}>
          {<label className="modal-header-text">{headerText}</label>}
          <span className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>&times;</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DraggableModal;
