import {styled} from "styled-components"
import { Link } from "react-router-dom";

export const NavLinkMobileContainer = styled(Link)`
  font-weight: 700;
  background: white;
  margin-top: 5px;
  color: var(--primary);
  cursor: pointer;
  &:hover {
    background: #f8fafc;
  }
`