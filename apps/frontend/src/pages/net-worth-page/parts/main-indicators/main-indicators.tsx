import { useState, useEffect } from "react";
import { NetWorthIndicators } from "@/pages-apis/net-worth/net-worth.types";
import { getLastNetWorthIndicators } from "@/pages-apis/net-worth/net-worth-api";   
import { VariationValuesContainer } from "./main.indicators.style";
import { formatMonth } from './../../../../utils/formatMonts';

export const MainIndicators = () => { 
    const [indicators, setIndicators] = useState<NetWorthIndicators | null>(null);  

    const fetchIndicators = async () => {
        const data = await getLastNetWorthIndicators();

        setIndicators(data);
    }
        useEffect(() => {
          void fetchIndicators();
         }, []);

           const lastTotal = indicators?.lastSnapshot?.total ?? 0;
           const previousTotal = indicators?.previousSnapshot?.total ?? 0;

        const variation = lastTotal - previousTotal;
        const variationPercentage = previousTotal !== 0 ? (variation / previousTotal) * 100 : 0;
        const formattedVariationPercentage = `${variation > 0 ? '+' : ''}${variationPercentage.toFixed(2)}%`;

    return (
            <div className="min-h-[100px] min-w-[100px] p-8">
                { indicators?.lastSnapshot ? (
                 <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-left justify-left min-w-[300px]">
                    <h3 className="mb-4text-lg font-semibold mb-2">{formatMonth(indicators?.lastSnapshot?.monthStart)}</h3>
                             <p>Net Worth {(indicators?.lastSnapshot?.total)}</p>
                        <div className= "flex items-center justify-left mb-4">
                                < VariationValuesContainer isPositive={variation > 0}>
                                 {formattedVariationPercentage} {variation.toFixed(2)}
                                </VariationValuesContainer>
                        </div>
            </div> ) : <>No data available</>}
        </div>
    )
}