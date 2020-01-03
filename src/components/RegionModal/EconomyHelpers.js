import React from 'react';
import { List } from 'semantic-ui-react';
import {
  capWithSpacing,
  remUnderscore,
  numScale,
} from '../../helpers/textHelpers';

export const formatAnnualValue = obj => {
  const { value, units, date } = obj;
  return `${numScale(value)} ${remUnderscore(units)} (${date})`;
};

export const formatDUVobj = obj => (
  <List.Item as="li">
    {obj.attribute && <strong>{`${capWithSpacing(obj.attribute)}: `}</strong>}
    {obj.annual_values
      .map(annual_value => formatAnnualValue(annual_value))
      .join(', ')}
    {obj.note && (
      <List as="ul">
        <List.Item as="li">
          <em>
            {'Note: '}
            {obj.note}
          </em>
        </List.Item>
      </List>
    )}
  </List.Item>
);
