import { InvestmentHistory } from "@/pages-apis/investment-history";
export interface InvestmentTableProps {
    investments: InvestmentHistory[];
     isLoading: boolean;
    onRefetch: () => void;
}