import { NavLinkMobileContainer } from "./nav-link-mobile.style"
import { NavLinkMobileProps } from "./nav-link-mobile.types"

export const NavLinkMobile = ({icon, path, title}: NavLinkMobileProps) => {
    return <div className="mb-4">
      <NavLinkMobileContainer to={path}>
        <div className="flex flex-row">
            {icon}
            <p className="ml-3">{title}</p>
        </div>
      </NavLinkMobileContainer>
       </div>
}