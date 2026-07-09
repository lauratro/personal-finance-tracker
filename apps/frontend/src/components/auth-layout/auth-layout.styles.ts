import { styled } from "styled-components"

export const Wrapper = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
`

export const CardContainer = styled.div`
  padding: 1.5rem;
  width: min(100%, 440px);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
  padding: 2rem;
`
export const TitleText = styled.p`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2563eb;
`