import styled from "styled-components";
import { Link } from "react-router-dom";

export const AppMenuWrapper = styled.header`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  position:fixed;
  z-index: 1000;
`

export const InnerContainer = styled.div`
  margin: 0 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

export const NavLink = styled(Link)`
  font-weight: 700;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  transition: background 0.2s ease;
  margin: 0 0.25rem;
  background: #eff6ff;
  color: #5F9EA0;
  border: 1px solid rgba(95, 158, 160, 0.4);
  cursor: pointer;
  &:hover {
    background: #f8fafc;
  }
`

export const LogoutButton = styled.button`
  border: 1px solid rgba(95, 158, 160, 0.4);
  background: rgba(95, 158, 160, 0.4);
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
   padding: 0.75rem 1rem;
  border-radius: 14px;
`

export const AppMenuUser = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`