import {styled} from "styled-components"

export const InnerContainerMobile = styled.div`
  margin: 0 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
`

export const NavContainer = styled.nav`
 display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
interface ColorDivider {
    colorDiv?: string
}

export const Divider = styled.hr<ColorDivider>`
 color: ${props => props.colorDiv ? props.colorDiv : "grey"};
 height: 3px;
 width: 100%;
`