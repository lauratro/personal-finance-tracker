import { NetWorthTable } from "./parts/net-worth-table"

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