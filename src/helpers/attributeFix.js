// Change entries of data object
const DataFix = (data, capitalMarkers) => {
  // Add missing country variants
  data.find(x => x.alpha3Code === "COG").altSpellings.push("Republic of the Congo");
  data.find(x => x.alpha3Code === "COD").altSpellings.push("Democratic Republic of the Congo");
  data.find(x => x.alpha3Code === "GBR").altSpellings.push("Britain");
  
  // Change display name of country to shorter variant
  ["VEN", "BOL", "GBR", "MDA", "MKD", "PSE", "SYR", "IRN", "PRK", "KOR", "LAO", "BRN", "COD", "TZA"]
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

  // Set null areas (data based on Wikipedia)
  data.find(x => x.alpha3Code === "PSE").area = 6220;
  data.find(x => x.alpha3Code === "SGS").area = 3903;
  data.find(x => x.alpha3Code === "SHN").area = 394;
  
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
}

// Change positioning of country labels
const CentroidsFix = centroids => {
  centroids.find(x => x.alpha3Code === "CAN").coordinates = [-100, 55];
  centroids.find(x => x.alpha3Code === "USA").coordinates = [-100, 40];
  centroids.find(x => x.alpha3Code === "CHL").coordinates = [-73, -39];
  centroids.find(x => x.alpha3Code === "FRA").coordinates = [2, 47];
  centroids.find(x => x.alpha3Code === "NOR").coordinates = [9, 61];
}

export { DataFix, CentroidsFix }