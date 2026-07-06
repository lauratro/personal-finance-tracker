import styled from "styled-components";

interface VariationValuesProps {
    isPositive: boolean;
}

export const VariationValuesContainer = styled.p<VariationValuesProps>`
 color: ${({ isPositive }) => (isPositive ? "green" : "red")};
`;  