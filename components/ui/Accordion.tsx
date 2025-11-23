'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  className,
}) => {
  return (
    <div
      className={cn(
        "border border-border rounded-xl overflow-hidden bg-background-surface transition-all duration-200",
        isOpen ? "border-brand-primary/50 shadow-brand-glow/10" : "hover:border-brand-primary/30",
        className
      )}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-6 text-left bg-background-surface hover:bg-background-elevated/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset"
        aria-expanded={isOpen}
      >
        <span className={cn("text-lg font-bold transition-colors", isOpen ? "text-brand-400" : "text-gray-100")}>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn("flex-shrink-0 ml-4", isOpen ? "text-brand-400" : "text-gray-400")}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 text-gray-400 leading-relaxed bg-background-surface">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};
