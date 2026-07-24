import { Accordion } from '@mantine/core';
import { AccordionNetWorthProps } from './accordion-net-worth.types';

export const AccordionNetWorth = ({ year, refreshKey, children }: AccordionNetWorthProps) => {
  return (
    <div className="p-0 md:p-4 bg-white border-primary mx-4 rounded">
        <Accordion defaultValue={year.toString()} variant="separated" chevronPosition="right" key={refreshKey}>
            <Accordion.Item key={year} value={String(year)}>
              <Accordion.Control>
                {year}
              </Accordion.Control>

              <Accordion.Panel>
               {children}
              </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
</div>
    );      
}