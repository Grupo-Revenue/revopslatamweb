import React, { createContext, useContext, useState, useCallback } from "react";

interface LeadFormContextType {
  isOpen: boolean;
  openLeadForm: (source?: string) => void;
  closeLeadForm: () => void;
  sourcePage: string;
}

const LeadFormContext = createContext<LeadFormContextType>({
  isOpen: false,
  openLeadForm: () => {},
  closeLeadForm: () => {},
  sourcePage: "",
});

export const useLeadForm = () => useContext(LeadFormContext);

export const LeadFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sourcePage, setSourcePage] = useState("");

  const openLeadForm = useCallback((source?: string) => {
    setSourcePage(source || window.location.pathname);
    setIsOpen(true);
  }, []);

  const closeLeadForm = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LeadFormContext.Provider value={{ isOpen, openLeadForm, closeLeadForm, sourcePage }}>
      {children}
    </LeadFormContext.Provider>
  );
};
