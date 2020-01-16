import React from 'react';
import { Tab, Container, Header, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateTable, objToArray, numScale } from '../../helpers/textHelpers';

const Energy = ({ data }) => {
  let {
    electricity,
    crude_oil,
    natural_gas,
    refined_petroleum_products,
    carbon_dioxide_emissions_from_consumption_of_energy,
    ...rest
  } = data;
  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  let cdEmissions = carbon_dioxide_emissions_from_consumption_of_energy;

  if (refined_petroleum_products) {
    refined_petroleum_products = objToArray(refined_petroleum_products);
  }

  if (natural_gas) {
    natural_gas = objToArray(natural_gas);
  }

  let electricityElements;
  if (electricity) {
    let {
      installed_generating_capacity,
      access,
      by_source,
      ...electricity_rest
    } = electricity;

    const electricityTable = objToArray(electricity_rest);
    by_source = objToArray(by_source);
    const igc = installed_generating_capacity;

    electricityElements = (
      <>
        <Header textAlign="center">Electricity</Header>
        {generateTable(electricityTable, 'Electricity breakdown')}
        {generateTable(by_source, 'Electricity by Source')}
        <List as="ul">
          {igc && (
            <List.Item as="li">
              {`Installed generating capacity: ${numScale(igc.kW)} kW (${
                igc.date
              } - global rank ${igc.global_rank})`}
            </List.Item>
          )}
          {access && (
            <List.Item as="li">
              {`Access: ${access.total_electrification.value} ${access.total_electrification.units} (${access.date})`}
            </List.Item>
          )}
        </List>
      </>
    );
  }

  return (
    <Tab.Pane>
      <Container text>
        {cdEmissions && (
          <List as="ul">
            <List.Item as="li">
              CO<sub>2</sub>
              {' emissions from energy consumption: '}
              {numScale(cdEmissions.megatonnes)}
              {` megatonnes (${cdEmissions.date})`}
            </List.Item>
            <List.Item>{`Global rank: ${cdEmissions.global_rank}`}</List.Item>
          </List>
        )}
        {refined_petroleum_products &&
          generateTable(
            refined_petroleum_products,
            'Refined Petroleum Products'
          )}
        {natural_gas && generateTable(natural_gas, 'Natural Gas')}

        {electricity && electricityElements}

        {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
      </Container>
    </Tab.Pane>
  );
};

export default Energy;
