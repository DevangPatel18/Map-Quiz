import React from 'react';
import { Tab, Container, Header } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateList, generateTable } from '../../helpers/textHelpers';

const TransnationalIssues = ({ data }) => {
  const {
    disputes,
    illicit_drugs,
    trafficking_in_persons,
    refugees_and_iternally_displaced_persons,
    ...rest
  } = data;
  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Tab.Pane>
      <Container text>
        <Header textAlign="center">Disputes</Header>
        {generateList(disputes)}
        {illicit_drugs && (
          <>
            <Header textAlign="center">Illicit Drugs</Header>
            {generateList(illicit_drugs.note.split(';'))}
          </>
        )}
        {trafficking_in_persons && (
          <>
            <Header textAlign="center">Trafficking in persons</Header>
            {trafficking_in_persons.current_situation && (
              <>
                <Header size="small" textAlign="center">
                  Current Situation
                </Header>
                {generateList(
                  trafficking_in_persons.current_situation.split(';')
                )}
              </>
            )}
            {trafficking_in_persons.tier_rating && (
              <>
                <Header size="small" textAlign="center">
                  Tier rating
                </Header>
                {generateList(trafficking_in_persons.tier_rating.split(';'))}
              </>
            )}
            {trafficking_in_persons.tier_2_watch_list && (
              <>
                <Header size="small" textAlign="center">
                  Tier 2 watch list
                </Header>
                {generateList(
                  trafficking_in_persons.tier_2_watch_list.split(';')
                )}
              </>
            )}
          </>
        )}
        {refugees_and_iternally_displaced_persons && (
          <>
            <Header textAlign="center">
              Refugees and iternally displaced persons
            </Header>

            {refugees_and_iternally_displaced_persons.note &&
              generateList(
                refugees_and_iternally_displaced_persons.note.split(';')
              )}

            {refugees_and_iternally_displaced_persons.stateless_persons && (
              <p>
                Stateless persons (
                {
                  refugees_and_iternally_displaced_persons.stateless_persons
                    .date
                }
                ):{' '}
                {refugees_and_iternally_displaced_persons.stateless_persons
                  .people ||
                  generateList(
                    refugees_and_iternally_displaced_persons.stateless_persons.note.split(
                      ';'
                    )
                  )}
              </p>
            )}
            {refugees_and_iternally_displaced_persons.refugees && (
              <>
                <Header size="small" textAlign="center">
                  Refugees
                </Header>
                {generateTable(
                  refugees_and_iternally_displaced_persons.refugees.by_country
                )}
              </>
            )}
          </>
        )}
        {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
      </Container>
    </Tab.Pane>
  );
};

export default TransnationalIssues;
