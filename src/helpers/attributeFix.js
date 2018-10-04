// Change entries of data object
const DataFix = (geoPath, data, capitalMarkers) => {
  const geographyPath = geoPath;
  const countryData = data;
  const capitalMarkersData = capitalMarkers;

  // Add missing country variants
  countryData.find(x => x.alpha3Code === 'COG').altSpellings = [ 'Republic of the Congo' ];
  countryData.find(x => x.alpha3Code === 'COD').altSpellings = [ 'Democratic Republic of the Congo' ];
  countryData.find(x => x.alpha3Code === 'GBR').altSpellings = [ 'Britain' ];
  countryData.find(x => x.alpha3Code === 'MAF').altSpellings = [ 'St Martin' ];
  countryData.find(x => x.alpha3Code === 'SXM').altSpellings = [ 'Sint Maarten' ];
  countryData.find(x => x.alpha3Code === 'VGB').altSpellings = [ 'British Virgin Islands' ];
  countryData.find(x => x.alpha3Code === 'VIR').altSpellings = [ 'US Virgin Islands' ];

  // Change display name of country to shorter variant
  ['VEN', 'BOL', 'GBR', 'MDA', 'MKD', 'PSE', 'SYR', 'IRN', 'PRK', 'KOR', 'LAO', 'BRN', 'COD', 'TZA', 'FSM', 'BLM', 'KNA', 'LCA', 'MAF', 'SHN', 'SPM', 'VCT', 'KOS']
    .forEach((code) => {
      const country = countryData.find(x => x.alpha3Code === code);
      if(country.altSpellings) {
        country.altSpellings.push(country.name);
      } else {
        country.altSpellings = [country.name];
      }
    });

  countryData.find(x => x.alpha3Code === 'VEN').name = 'Venezuela';
  countryData.find(x => x.alpha3Code === 'BOL').name = 'Bolivia';
  countryData.find(x => x.alpha3Code === 'GBR').name = 'United Kingdom';
  countryData.find(x => x.alpha3Code === 'MDA').name = 'Moldova';
  countryData.find(x => x.alpha3Code === 'MKD').name = 'Macedonia';
  countryData.find(x => x.alpha3Code === 'KOS').name = 'Kosovo';
  countryData.find(x => x.alpha3Code === 'PSE').name = 'Palestine';
  countryData.find(x => x.alpha3Code === 'SYR').name = 'Syria';
  countryData.find(x => x.alpha3Code === 'IRN').name = 'Iran';
  countryData.find(x => x.alpha3Code === 'PRK').name = 'North Korea';
  countryData.find(x => x.alpha3Code === 'KOR').name = 'South Korea';
  countryData.find(x => x.alpha3Code === 'LAO').name = 'Laos';
  countryData.find(x => x.alpha3Code === 'BRN').name = 'Brunei';
  countryData.find(x => x.alpha3Code === 'COD').name = 'DR Congo';
  countryData.find(x => x.alpha3Code === 'TZA').name = 'Tanzania';
  countryData.find(x => x.alpha3Code === 'FSM').name = 'Micronesia';
  countryData.find(x => x.alpha3Code === 'BLM').name = 'St Barthélemy';
  countryData.find(x => x.alpha3Code === 'KNA').name = 'St Kitts and Nevis';
  countryData.find(x => x.alpha3Code === 'LCA').name = 'St Lucia';
  countryData.find(x => x.alpha3Code === 'MAF').name = 'St Martin (French part)';
  countryData.find(x => x.alpha3Code === 'SHN').name = 'St Helena, Ascension and Tristan da Cunha';
  countryData.find(x => x.alpha3Code === 'SPM').name = 'St Pierre and Miquelon';
  countryData.find(x => x.alpha3Code === 'VCT').name = 'St Vincent and the Grenadines';

  // Set null areas (data based on Wikipedia)
  countryData.find(x => x.alpha3Code === 'PSE').area = 6220;
  countryData.find(x => x.alpha3Code === 'SGS').area = 3903;
  countryData.find(x => x.alpha3Code === 'SHN').area = 394;
  countryData.find(x => x.alpha3Code === 'REU').area = 2511;
  countryData.find(x => x.alpha3Code === 'MYT').area = 374;
  countryData.find(x => x.alpha3Code === 'GUF').area = 83534;
  countryData.find(x => x.alpha3Code === 'MTQ').area = 1128;
  countryData.find(x => x.alpha3Code === 'GLP').area = 1628;
  countryData.find(x => x.alpha3Code === 'SJM').area = 62049;

  countryData.find(x => x.alpha3Code === 'KOS').numericCode = 999;
  countryData.find(x => x.alpha3Code === 'KOS').alpha2Code = 'KO';

  // Create geography paths for regions of France
  const france = geographyPath.find(x => x.id === '250');
  const frenchguiana = JSON.parse(JSON.stringify(france));
  const guadeloupe = JSON.parse(JSON.stringify(france));
  const martinique = JSON.parse(JSON.stringify(france));
  const mayotte = JSON.parse(JSON.stringify(france));
  const reunion = JSON.parse(JSON.stringify(france));
  frenchguiana.id = '254';
  guadeloupe.id = '312';
  martinique.id = '474';
  mayotte.id = '175';
  reunion.id = '638';

  // Create geography path for Bonaire
  const netherlands = geographyPath.find(x => x.id === '528');
  const bonaire = JSON.parse(JSON.stringify(netherlands));
  bonaire.id = '535';

  // Set numericCode for Christmas Island
  geographyPath[98].id = '162';
  const cocos = JSON.parse(JSON.stringify(geographyPath[98]));
  cocos.id = '166';

  // Create geography path for Svalbard
  const norway = geographyPath.find(x => x.id === '578');
  const svalbard = JSON.parse(JSON.stringify(norway));
  svalbard.id = '744';

  // Create geography path for Tokelau
  const newzealand = geographyPath.find(x => x.id === '554');
  const tokelau = JSON.parse(JSON.stringify(newzealand));
  tokelau.id = '772';

  geographyPath.push(
    frenchguiana, guadeloupe, martinique, mayotte, reunion, bonaire, cocos, svalbard, tokelau,
  );

  // Remove Ashmore Reef to prevent extra Australia label
  geographyPath.splice(11, 1);

  // Set numericCode for Kosovo
  geographyPath[117].id = '999';

  // Add capitals for Overseas regions
  const extraCapitals = [
    { name: 'Cayenne', alpha3Code: 'GUF', coordinates: [-52.3135, 4.9224] },
    { name: 'Saint-Denis', alpha3Code: 'REU', coordinates: [55.4551, -20.8907] },
    { name: 'Fort-de-France', alpha3Code: 'MTQ', coordinates: [-61.0588, 14.6161] },
    { name: 'Mamoudzou', alpha3Code: 'MYT', coordinates: [45.2279, -12.7809] },
    { name: 'Basse-Terre', alpha3Code: 'GLP', coordinates: [-61.6947, 16.0341] },
    { name: 'Kralendijk', alpha3Code: 'BES', coordinates: [-68.2655, 12.1443] },
    { name: 'Fakaofo', alpha3Code: 'TKL', coordinates: [-171.2188, -9.3803] },
  ];

  extraCapitals.forEach((capitalObj) => {
    capitalMarkersData.push({ ...capitalObj, markerOffset: -7 });
  });

  // Add "Region of" designation for overseas regions
  const overseasRegions = {
    NZL: ['COK', 'NIU', 'TKL'],
    GBR: ['AIA', 'BMU', 'IOT', 'VGB', 'CYM', 'FLK', 'MSR', 'PCN', 'SHN', 'TCA', 'SGS', 'GGY', 'JEY', 'IMN'],
    USA: ['GUM', 'MNP', 'PRI', 'VIR', 'ASM'],
    AUS: ['CXR', 'CCK', 'NFK', 'HMD'],
    CHN: ['HKG', 'MAC'],
    DNK: ['FRO', 'GRL'],
    FRA: ['BLM', 'MAF', 'SPM', 'WLF', 'PYF', 'NCL', 'REU', 'GLP', 'MTQ', 'GUF', 'MYT'],
    NLD: ['ABW', 'CUW', 'SXM', 'BES'],
  };

  Object.keys(overseasRegions).forEach((countryAlpha) => {
    // for (const regionAlpha of overseasRegions[countryAlpha]) {
    overseasRegions[countryAlpha].forEach((regionAlpha) => {
      countryData.find(x => x.alpha3Code === regionAlpha).regionOf = countryAlpha;
    });
  });
};

// Change positioning of country labels
const CountryMarkersFix = (centroids) => {
  const centroidsData = centroids;

  centroidsData.find(x => x.alpha3Code === 'CAN').coordinates = [-100, 55];
  centroidsData.find(x => x.alpha3Code === 'USA').coordinates = [-100, 40];
  centroidsData.find(x => x.alpha3Code === 'CHL').coordinates = [-73, -39];
  centroidsData.find(x => x.alpha3Code === 'FJI').coordinates = [177.5, -18];
  centroidsData.find(x => x.alpha3Code === 'KIR').coordinates = [189, -1];
  centroidsData.find(x => x.alpha3Code === 'MHL').coordinates = [169, 8.5];
  centroidsData.find(x => x.alpha3Code === 'FSM').coordinates = [151, 7.5];
  centroidsData.find(x => x.alpha3Code === 'MNP').coordinates = [145.5, 16.5];
  centroidsData.find(x => x.alpha3Code === 'SLB').coordinates = [161.6, -9.75];
  centroidsData.find(x => x.alpha3Code === 'VUT').coordinates = [168.5, -17];
  centroidsData.find(x => x.alpha3Code === 'NCL').coordinates = [163.8, -20.9];
  centroidsData.find(x => x.alpha3Code === 'PLW').coordinates = [133, 6];

  centroidsData.find(x => x.alpha3Code === 'SUR').markerOffset = -10;
  centroidsData.find(x => x.alpha3Code === 'GUY').markerOffset = -15;
  centroidsData.find(x => x.alpha3Code === 'DOM').markerOffset = 10;
  centroidsData.find(x => x.alpha3Code === 'GMB').markerOffset = 3;
  centroidsData.find(x => x.alpha3Code === 'GNB').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'GIN').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'SLE').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'LBR').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'NGA').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'CIV').markerOffset = 22;
  centroidsData.find(x => x.alpha3Code === 'GHA').markerOffset = 10;
  centroidsData.find(x => x.alpha3Code === 'TGO').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'CAF').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'CMR').markerOffset = 10;
  centroidsData.find(x => x.alpha3Code === 'COD').markerOffset = -17;
  centroidsData.find(x => x.alpha3Code === 'COG').markerOffset = 10;
  centroidsData.find(x => x.alpha3Code === 'KEN').markerOffset = 10;
  centroidsData.find(x => x.alpha3Code === 'COM').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'MUS').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'ZAF').markerOffset = -8;
  centroidsData.find(x => x.alpha3Code === 'MWI').markerOffset = -5;

  centroidsData.find(x => x.alpha3Code === 'AUT').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'CHE').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'SVN').markerOffset = -3;
  centroidsData.find(x => x.alpha3Code === 'HRV').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'BIH').markerOffset = -7;
  centroidsData.find(x => x.alpha3Code === 'SRB').markerOffset = 3;
  centroidsData.find(x => x.alpha3Code === 'MNE').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'ALB').markerOffset = 5;

  centroidsData.find(x => x.alpha3Code === 'ISR').markerOffset = 10;
  centroidsData.find(x => x.alpha3Code === 'JOR').markerOffset = 10;
  centroidsData.find(x => x.alpha3Code === 'LBN').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'GEO').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'ARM').markerOffset = -8;
  centroidsData.find(x => x.alpha3Code === 'TKM').markerOffset = 5;
  centroidsData.find(x => x.alpha3Code === 'AZE').markerOffset = 3;
  centroidsData.find(x => x.alpha3Code === 'BRN').markerOffset = -5;
  centroidsData.find(x => x.alpha3Code === 'BRN').markerOffset = -5;

  centroidsData.find(x => x.alpha3Code === 'WLF').markerOffset = -10;
  centroidsData.find(x => x.alpha3Code === 'ASM').markerOffset = 10;
}

const CapitalMarkersFix = (capitalMarkers) => {
  const capitalMarkersData = capitalMarkers;

  capitalMarkersData.find(x => x.alpha3Code === 'GTM').markerOffset = 10;
  capitalMarkersData.find(x => x.alpha3Code === 'SLV').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'CRI').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'URY').markerOffset = 15;
  capitalMarkersData.find(x => x.alpha3Code === 'GUY').markerOffset = -10;
  capitalMarkersData.find(x => x.alpha3Code === 'SUR').markerOffset = -5;
  capitalMarkersData.find(x => x.alpha3Code === 'GUF').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'DOM').markerOffset = 0;

  capitalMarkersData.find(x => x.alpha3Code === 'CPV').markerOffset = -10;
  capitalMarkersData.find(x => x.alpha3Code === 'SEN').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'GMB').markerOffset = 2;
  capitalMarkersData.find(x => x.alpha3Code === 'GNB').markerOffset = 2;
  capitalMarkersData.find(x => x.alpha3Code === 'GIN').markerOffset = 2;
  capitalMarkersData.find(x => x.alpha3Code === 'SLE').markerOffset = 6;
  capitalMarkersData.find(x => x.alpha3Code === 'LBR').markerOffset = 4;
  capitalMarkersData.find(x => x.alpha3Code === 'BFA').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'CIV').markerOffset = -10;
  capitalMarkersData.find(x => x.alpha3Code === 'GHA').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'TGO').markerOffset = 5;
  capitalMarkersData.find(x => x.alpha3Code === 'BEN').markerOffset = -3;
  capitalMarkersData.find(x => x.alpha3Code === 'NGA').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'STP').markerOffset = -5;
  capitalMarkersData.find(x => x.alpha3Code === 'GNQ').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'GAB').markerOffset = 10;
  capitalMarkersData.find(x => x.alpha3Code === 'COG').markerOffset = -5;
  capitalMarkersData.find(x => x.alpha3Code === 'COD').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'CAF').markerOffset = -10;
  capitalMarkersData.find(x => x.alpha3Code === 'ERI').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'BDI').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'MYT').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'REU').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'ZAF').markerOffset = -3;
  capitalMarkersData.find(x => x.alpha3Code === 'LSO').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'SWZ').markerOffset = 13;

  capitalMarkersData.find(x => x.alpha3Code === 'EST').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'SVK').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'HUN').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'HRV').markerOffset = 8;
  capitalMarkersData.find(x => x.alpha3Code === 'SVN').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'CHE').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'AND').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'MCO').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'VAT').markerOffset = 15;
  capitalMarkersData.find(x => x.alpha3Code === 'BIH').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'ALB').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'MKD').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'MNE').markerOffset = 0;
  capitalMarkersData.find(x => x.alpha3Code === 'BGR').markerOffset = 5;

  capitalMarkersData.find(x => x.alpha3Code === 'ARM').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'PSE').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'JOR').markerOffset = 3;
  capitalMarkersData.find(x => x.alpha3Code === 'IRQ').markerOffset = -3;
  capitalMarkersData.find(x => x.alpha3Code === 'KWT').markerOffset = -3;
  capitalMarkersData.find(x => x.alpha3Code === 'SYR').markerOffset = -12;
  capitalMarkersData.find(x => x.alpha3Code === 'OMN').markerOffset = 12;
  capitalMarkersData.find(x => x.alpha3Code === 'ARE').markerOffset = -3;
  capitalMarkersData.find(x => x.alpha3Code === 'AFG').markerOffset = -9;
  capitalMarkersData.find(x => x.alpha3Code === 'PAK').markerOffset = -5;
  capitalMarkersData.find(x => x.alpha3Code === 'IND').markerOffset = -9;
  capitalMarkersData.find(x => x.alpha3Code === 'NPL').markerOffset = -5;
  capitalMarkersData.find(x => x.alpha3Code === 'BTN').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'BGD').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'KOR').markerOffset = 13;

  capitalMarkersData.find(x => x.alpha3Code === 'GUM').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'KIR').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'ASM').markerOffset = 13;
  capitalMarkersData.find(x => x.alpha3Code === 'WLF').markerOffset = -10;
  capitalMarkersData.find(x => x.alpha3Code === 'WSM').markerOffset = -3;
};

function SeparateRegions(data) {
  const countryData = data;
  // Separate France into regions
  const coordsFRA = countryData.find(x => x.properties.alpha3Code === 'FRA').geometry.coordinates.splice(0, 7);
  countryData.find(x => x.properties.alpha3Code === 'REU').geometry.coordinates = [coordsFRA[0]];
  countryData.find(x => x.properties.alpha3Code === 'MYT').geometry.coordinates = [coordsFRA[1]];
  countryData.find(x => x.properties.alpha3Code === 'GUF').geometry.coordinates = [coordsFRA[2]];
  countryData.find(x => x.properties.alpha3Code === 'MTQ').geometry.coordinates = [coordsFRA[3]];
  countryData.find(x => x.properties.alpha3Code === 'GLP').geometry.coordinates = coordsFRA.slice(4);

  // Separate Netherlands into regions
  const coordsNLD = countryData.find(x => x.properties.alpha3Code === 'NLD').geometry.coordinates.splice(0, 3);
  countryData.find(x => x.properties.alpha3Code === 'BES').geometry.coordinates = coordsNLD;

  // Separate Cocos from Christmas
  const coordsCXR = countryData.find(x => x.properties.alpha3Code === 'CXR').geometry.coordinates.splice(0, 2);
  countryData.find(x => x.properties.alpha3Code === 'CCK').geometry.coordinates = coordsCXR;

  // Separate Svalbard from Norway
  const coordsNOR = countryData.find(x => x.properties.alpha3Code === 'NOR').geometry.coordinates.splice(22, 10);
  countryData.find(x => x.properties.alpha3Code === 'SJM').geometry.coordinates = coordsNOR;

  // Separate Tokelau from New Zealand
  const coordsNZL = countryData.find(x => x.properties.alpha3Code === 'NZL').geometry.coordinates.splice(11, 2);
  countryData.find(x => x.properties.alpha3Code === 'TKL').geometry.coordinates = coordsNZL;
}

export { DataFix, CountryMarkersFix, CapitalMarkersFix, SeparateRegions };
