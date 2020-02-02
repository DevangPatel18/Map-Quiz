import React from 'react';
import { List } from 'semantic-ui-react';
import { capWithSpacing } from '../../helpers/textHelpers';

export const generatePeopleItem = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, dataObj] = entries[0];
  if (typeof dataObj !== 'object') return '';
  const { date, global_rank, ...rest } = dataObj;
  const numFigureObj = Object.entries(rest)[0];
  const [text, num] = numFigureObj;
  return (
    <List.Item>
      {title && <strong>{capWithSpacing(title)}:</strong>}
      {num && ` ${num}`}
      {text && ` ${capWithSpacing(text)}`}
      {date && ` (${date})`}
      {global_rank && <sup> (global rank - {global_rank})</sup>}
    </List.Item>
  );
};
