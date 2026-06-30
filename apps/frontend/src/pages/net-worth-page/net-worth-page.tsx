import { NetWorthTable } from "./parts/net-worth-table";
import { PageContainer } from "../../containers/page-container/page-container";
export const NetWorthPage = () => {

          return (
            <PageContainer
              title="Net Worth"
              description="Track your investment performance over time."
            >
                <NetWorthTable />
            </PageContainer>
    )
}