import { useState } from 'react';
import { NetWorthTable } from "./parts/net-worth-table";
import { PageContainer } from "../../containers/page-container/page-container";
import { CreateNetWorthButton } from "./parts/create-net-worth-button";

export const NetWorthPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshSnapshots = () => setRefreshKey((current) => current + 1);

  return (
    <PageContainer
      title="Net Worth"
      description="Track your investment performance over time."
    >
      <CreateNetWorthButton onCreated={refreshSnapshots} />
      <NetWorthTable refreshKey={refreshKey} />
    </PageContainer>
  );
};
