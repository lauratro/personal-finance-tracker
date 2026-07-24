
import { InnerContainerMobile, NavContainer, Divider } from "./mobile-menu.styles";
import { MobileMenuProps } from "./mobile-menu.types";
import { Modal, Button } from "@mantine/core";
import { useAuth } from '../../../pages-apis/auth/auth-context';
import { routePaths } from '../../../navigation/main-navigation';
import { IconCreditCard } from '@tabler/icons-react';
import { NavLinkMobile } from "./parts/nav-link-mobile/nav-link-mobile";
import { IconDatabase } from '@tabler/icons-react';
import { IconChartHistogram } from '@tabler/icons-react';

export const MobileMenu = ({isMenuOpen, setIsMenuOpen} : MobileMenuProps ) => {
  const {  logout } = useAuth();

    return (
        <div>
            <Modal opened ={isMenuOpen} onClose={()=> setIsMenuOpen(false)}>
                <InnerContainerMobile>
     <NavContainer>
          < NavLinkMobile path={routePaths.dashboard} title={"Dashboard"} icon={<IconChartHistogram/>}/>
          < NavLinkMobile path={routePaths.investmentsHistory} title={"Investments History"} icon={<IconDatabase/>}/>
          < NavLinkMobile path={routePaths.netWorth} title={"Net Worth"} icon= {<IconCreditCard/>}/>
        </NavContainer>
   <Divider/>
        <div className="app-menubar-user">
          <Button className="button-primary" type="button" onClick={logout}>
            Logout
          </Button>
        </div>
            </InnerContainerMobile>
            </Modal>
        </div>
    )

}