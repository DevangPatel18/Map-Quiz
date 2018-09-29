// Change entries of data object
const DataFix = (geoData, data, capitalMarkers) => {
  // Add missing country variants
  data.find(x => x.alpha3Code === "COG").altSpellings.push("Republic of the Congo");
  data.find(x => x.alpha3Code === "COD").altSpellings.push("Democratic Republic of the Congo");
  data.find(x => x.alpha3Code === "GBR").altSpellings.push("Britain");
  data.find(x => x.alpha3Code === "MAF").altSpellings.push("St Martin");
  data.find(x => x.alpha3Code === "SXM").altSpellings.push("Sint Maarten");
  data.find(x => x.alpha3Code === "VGB").altSpellings.push("British Virgin Islands");
  data.find(x => x.alpha3Code === "VIR").altSpellings.push("US Virgin Islands");
  
  // Change display name of country to shorter variant
  ["VEN", "BOL", "GBR", "MDA", "MKD", "PSE", "SYR", "IRN", "PRK", "KOR", "LAO", "BRN", "COD", "TZA", "FSM", "BLM", "KNA", "LCA", "MAF", "SHN", "SPM", "VCT"]
    .forEach(code => {
      let country = data.find(x => x.alpha3Code === code)
      country.altSpellings.push(country.name)
    })

  data.find(x => x.alpha3Code === "VEN").name = "Venezuela";
  data.find(x => x.alpha3Code === "BOL").name = "Bolivia";
  data.find(x => x.alpha3Code === "GBR").name = "United Kingdom";
  data.find(x => x.alpha3Code === "MDA").name = "Moldova";
  data.find(x => x.alpha3Code === "MKD").name = "Macedonia";
  data.find(x => x.alpha3Code === "PSE").name = "Palestine";
  data.find(x => x.alpha3Code === "SYR").name = "Syria";
  data.find(x => x.alpha3Code === "IRN").name = "Iran";
  data.find(x => x.alpha3Code === "PRK").name = "North Korea";
  data.find(x => x.alpha3Code === "KOR").name = "South Korea";
  data.find(x => x.alpha3Code === "LAO").name = "Laos";
  data.find(x => x.alpha3Code === "BRN").name = "Brunei";
  data.find(x => x.alpha3Code === "COD").name = "DR Congo";
  data.find(x => x.alpha3Code === "TZA").name = "Tanzania";
  data.find(x => x.alpha3Code === "FSM").name = "Micronesia";
  data.find(x => x.alpha3Code === "BLM").name = "St Barthélemy";
  data.find(x => x.alpha3Code === "KNA").name = "St Kitts and Nevis";
  data.find(x => x.alpha3Code === "LCA").name = "St Lucia";
  data.find(x => x.alpha3Code === "MAF").name = "St Martin (French part)";
  data.find(x => x.alpha3Code === "SHN").name = "St Helena, Ascension and Tristan da Cunha";
  data.find(x => x.alpha3Code === "SPM").name = "St Pierre and Miquelon";
  data.find(x => x.alpha3Code === "VCT").name = "St Vincent and the Grenadines";

  // Set null areas (data based on Wikipedia)
  data.find(x => x.alpha3Code === "PSE").area = 6220;
  data.find(x => x.alpha3Code === "SGS").area = 3903;
  data.find(x => x.alpha3Code === "SHN").area = 394;
  data.find(x => x.alpha3Code === "REU").area = 2511;
  data.find(x => x.alpha3Code === "MYT").area = 374;
  data.find(x => x.alpha3Code === "GUF").area = 83534;
  data.find(x => x.alpha3Code === "MTQ").area = 1128;
  data.find(x => x.alpha3Code === "GLP").area = 1628;
  
  // Add Kosovo data
  data.push({
    alpha3Code: "XKX",
    name: "Kosovo",
    capital: "Prishtina",
    population: 1920079,
    area: 10908,
    numericCode: "999",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Flag_of_Kosovo.svg/320px-Flag_of_Kosovo.svg.png",
    altSpellings: [],
    translations: {}
  });

  capitalMarkers.push({
    name: "Prishtina",
    alpha3Code: "XKX",
    coordinates: [21.166191, 42.667542],
    markerOffset: -7
  })

  // Create geography paths for regions of France
  let france = geoData.find(x => x.id === "250");
  let frenchguiana = JSON.parse(JSON.stringify(france));
  let guadeloupe = JSON.parse(JSON.stringify(france));
  let martinique = JSON.parse(JSON.stringify(france));
  let mayotte = JSON.parse(JSON.stringify(france));
  let reunion = JSON.parse(JSON.stringify(france));
  frenchguiana.id = "254";
  guadeloupe.id = "312";
  martinique.id = "474";
  mayotte.id = "175";
  reunion.id = "638";

  // Create geography path for Bonaire
  let netherlands = geoData.find(x => x.id === "528");
  let bonaire = JSON.parse(JSON.stringify(netherlands));
  bonaire.id = "535"

  geoData.push(frenchguiana, guadeloupe, martinique, mayotte, reunion, bonaire)

  // Remove Ashmore Reef to prevent extra Australia label
  geoData.splice(11, 1)

  // Set numericCode for Kosovo
  geoData[117].id = "999";

  // Add capitals for Overseas regions
  capitalMarkers.push({
    name: "Cayenne",
    alpha3Code: "GUF",
    coordinates: [-52.3135, 4.9224],
    markerOffset: -7
  })

  capitalMarkers.push({
    name: "Saint-Denis",
    alpha3Code: "REU",
    coordinates: [55.4551, -20.8907],
    markerOffset: -7
  })

  capitalMarkers.push({
    name: "Fort-de-France",
    alpha3Code: "MTQ",
    coordinates: [-61.0588, 14.6161],
    markerOffset: -7
  })

  capitalMarkers.push({
    name: "Mamoudzou",
    alpha3Code: "MYT",
    coordinates: [45.2279, -12.7809],
    markerOffset: -7
  })

  capitalMarkers.push({
    name: "Basse-Terre", 
    alpha3Code: "GLP",
    coordinates: [-61.6947, 16.0341],
    markerOffset: -7
  })
// 12.1443° N, 68.2655° W
  capitalMarkers.push({
    name: "Kralendijk", 
    alpha3Code: "BES",
    coordinates: [-68.2655, 12.1443],
    markerOffset: -7
  })  
}

// Change positioning of country labels
const CentroidsFix = centroids => {
  centroids.find(x => x.alpha3Code === "CAN").coordinates = [-100, 55];
  centroids.find(x => x.alpha3Code === "USA").coordinates = [-100, 40];
  centroids.find(x => x.alpha3Code === "CHL").coordinates = [-73, -39];
  centroids.find(x => x.alpha3Code === "NOR").coordinates = [9, 61];
  centroids.find(x => x.alpha3Code === "FJI").coordinates = [177.5, -18];
  centroids.find(x => x.alpha3Code === "KIR").coordinates = [189, -1];
  centroids.find(x => x.alpha3Code === "MHL").coordinates = [169, 8.5];
  centroids.find(x => x.alpha3Code === "FSM").coordinates = [151, 7.5];
  centroids.find(x => x.alpha3Code === "MNP").coordinates = [145.5, 16.5];
  centroids.find(x => x.alpha3Code === "SLB").coordinates = [161.6, -9.75];
  centroids.find(x => x.alpha3Code === "VUT").coordinates = [168.5, -17];
  centroids.find(x => x.alpha3Code === "NCL").coordinates = [163.8, -20.9];
  centroids.find(x => x.alpha3Code === "PLW").coordinates = [133, 6];
}

function SeparateRegions(data) {
  // Separate France into regions
  let FRA_coords = data.find(x => x.properties.alpha3Code === "FRA").geometry.coordinates.splice(0, 7);
  data.find(x => x.properties.alpha3Code === "REU").geometry.coordinates = [FRA_coords[0]];
  data.find(x => x.properties.alpha3Code === "MYT").geometry.coordinates = [FRA_coords[1]];
  data.find(x => x.properties.alpha3Code === "GUF").geometry.coordinates = [FRA_coords[2]];
  data.find(x => x.properties.alpha3Code === "MTQ").geometry.coordinates = [FRA_coords[3]];
  data.find(x => x.properties.alpha3Code === "GLP").geometry.coordinates = FRA_coords.slice(4);

  // Separate Netherlands into regions
  let NLD_coords = data.find(x => x.properties.alpha3Code === "NLD").geometry.coordinates.splice(0, 3);
  data.find(x => x.properties.alpha3Code === "BES").geometry.coordinates = NLD_coords
}

export { DataFix, CentroidsFix, SeparateRegions }