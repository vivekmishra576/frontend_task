import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './MultiSelectDropdown.css';

interface Option {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedIds,
  onChange,
  placeholder = 'Choose from Drop-down',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter(id => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  const removeOption = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter(id => id !== optionId));
  };

  const getSelectedNames = () => {
    return options
      .filter(opt => selectedIds.includes(opt.id))
      .map(opt => opt.name);
  };

  const selectedNames = getSelectedNames();

  return (
    <div className="multi-select-container" ref={dropdownRef}>
      <div
        className={`multi-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="multi-select-value">
          {selectedNames.length === 0 ? (
            <span className="multi-select-placeholder">{placeholder}</span>
          ) : (
            <div className="selected-items-inline">
              {selectedNames.map((name, index) => {
                const option = options.find(opt => opt.name === name);
                return option ? (
                  <span key={option.id} className="selected-item-chip">
                    {name}
                    <button
                      type="button"
                      className="chip-remove-btn"
                      onClick={(e) => removeOption(option.id, e)}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
        <ChevronDown 
          size={16} 
          className={`dropdown-arrow ${isOpen ? 'rotate' : ''}`}
        />
      </div>

      {isOpen && !disabled && (
        <div className="multi-select-dropdown">
          {options.length === 0 ? (
            <div className="dropdown-empty">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                className={`dropdown-option ${selectedIds.includes(option.id) ? 'selected' : ''}`}
                onClick={() => toggleOption(option.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(option.id)}
                  onChange={() => {}}
                  className="option-checkbox"
                />
                <span className="option-label">{option.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
