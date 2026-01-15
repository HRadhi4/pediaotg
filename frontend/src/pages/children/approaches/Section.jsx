/**
 * Section Component - Collapsible section for Approaches
 * Shared across all approach components
 */

import { useRef } from "react";

const Section = ({ id, title, children, defaultOpen = false, expandedSections, toggleSection }) => {
  const sectionRef = useRef(null);
  const isOpen = expandedSections[id] ?? defaultOpen;
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSection(id, sectionRef.current);
  };
  
  return (
    <div ref={sectionRef} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={handleClick}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-sm text-left flex-1 pr-2 break-words">{title}</span>
        <span className={`transform transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="p-4 space-y-3 text-sm break-words overflow-hidden">{children}</div>}
    </div>
  );
};

export default Section;
