import { useEffect, useState } from 'react';
import { NetWorthDisplayer } from "./parts/net-worth-displayer";
import { PageContainer } from "../../containers/page-container/page-container";
import { CreateNetWorthButton } from "./parts/create-net-worth-button";
import {getNetWorthYearsList} from "@/pages-apis/net-worth";

export const NetWorthPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const refreshSnapshots = () => setRefreshKey((current) => current + 1);

 const yearsList = async() => (await getNetWorthYearsList())
 
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
      <h2 className="text-lg font-semibold mt-4 mb-2">
        {year}
      </h2>

      <NetWorthDisplayer
        refreshKey={refreshKey}
        year={year}
      />
    </div>
  ));
}

  return (
    <PageContainer
      title="Net Worth"
      description="Track your investment performance over time."
    >
         <CreateNetWorthButton onCreated={refreshSnapshots} />
    {content}
    </PageContainer>
  );
};
