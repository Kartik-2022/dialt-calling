// src/components/ui/Select.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './Button'; 


const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen, value, onValueChange })
      )}
    </div>
  );
};

const SelectTrigger = ({ children, className = '', isOpen, setIsOpen, value, id }) => {
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={isOpen}
      className={`w-full justify-between ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      id={id} // Pass id to the button element
    >
      {React.Children.map(children, child =>
        child.type === SelectValue ? React.cloneElement(child, { value }) : child
      )}
      <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </Button>
  );
};

const SelectValue = ({ value }) => {
  return <span>{value}</span>;
};

const SelectContent = ({ children, isOpen, onValueChange, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    // Explicitly set background to white (bg-white) and ensure text is dark (text-gray-900)
    // The z-50 class ensures it's on top.
    <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-gray-900 shadow-md animate-in fade-in-80 mt-1 w-full">
      <div className="p-1">
        {React.Children.map(children, child =>
          React.cloneElement(child, { onValueChange, setIsOpen })
        )}
      </div>
    </div>
  );
};

const SelectItem = ({ children, value, onValueChange, setIsOpen }) => {
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value);
    }
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div
      onClick={handleClick}
     
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-200"
    >
      {children}
    </div>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
