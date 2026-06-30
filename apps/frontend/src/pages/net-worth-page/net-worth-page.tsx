import { NetWorthTable } from "./parts/net-worth-table";
import { PageContainer } from "../../containers/page-container/page-container";
import { CreateNetWorthButton } from "./parts/create-net-worth-button";
export const NetWorthPage = () => {

          return (
            <PageContainer
              title="Net Worth"
              description="Track your investment performance over time."
            >
                  <CreateNetWorthButton />
                <NetWorthTable />
            </PageContainer>
    )
}