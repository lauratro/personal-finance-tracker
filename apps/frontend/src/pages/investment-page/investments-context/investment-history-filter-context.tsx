import { createContext, useContext, useState } from 'react';


type InvestmentHistoryFilters = {
  fromDate?: string;
  untilDate?: string;
};

type InvestmentHistoryFilterContextType = {
  filters: InvestmentHistoryFilters;
  setFilters: React.Dispatch<
    React.SetStateAction<InvestmentHistoryFilters>
  >;
};

const InvestmentHistoryFilterContext =
  createContext<InvestmentHistoryFilterContextType | null>(null);

export const InvestmentHistoryFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
const [filters, setFilters] = useState<InvestmentHistoryFilters>({});

  return (
    <InvestmentHistoryFilterContext.Provider
      value={{
        filters,
        setFilters
      }}
    >
      {children}
    </InvestmentHistoryFilterContext.Provider>
  );
};

export const useInvestmentHistoryFilter = () => {
  const context = useContext(InvestmentHistoryFilterContext);

   if (!context) {
    throw new Error(
      "useInvestmentHistoryFilter must be used within InvestmentHistoryFilterProvider"
    );
  }

  return context;
};