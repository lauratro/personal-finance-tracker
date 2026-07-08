import { useEffect, useState } from 'react';
import { NetWorthDisplayer } from "./parts/net-worth-displayer";
import { PageContainer } from "../../containers/page-container/page-container";
import { CreateNetWorthButton } from "./parts/create-net-worth-button";
import {getNetWorthYearsList} from "@/pages-apis/net-worth";
import { AccordionNetWorth } from './parts/accordion-net-worth';
import { MainIndicators } from './parts/main-indicators';
import { NetWorthCharts } from './parts/net-worth-charts/net-worth-charts';

export const NetWorthPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const refreshSnapshots = () => setRefreshKey((current) => current + 1);
 
 useEffect(() => {
  const fetchYears = async () => {
    try {
      const data = await getNetWorthYearsList();

      setYears(data);
    } finally {
      setLoadingYears(false);
    }
  };

  void fetchYears();
}, []);

let content: React.ReactNode;

if (loadingYears) {
  content = <p>Loading years...</p>;
} else if (years.length === 0) {
  content = <p>No net worth snapshots available.</p>;
} else {
  content = years.map((year) => (
    <div key={year}>
     <AccordionNetWorth year={year} refreshKey={refreshKey}>
        <NetWorthDisplayer
          refreshKey={refreshKey}
          year={year}
        />
      </AccordionNetWorth>
    </div>
  ));
}

  return (
    <PageContainer
      title="Net Worth"
      description="Track your investment performance over time."
    >
      <div className="flex justify-between items-center mb-4 px-4">
      <MainIndicators />
      <CreateNetWorthButton onCreated={refreshSnapshots} />
      </div>
            <NetWorthCharts />
    {content}
    </PageContainer>
  );
};
