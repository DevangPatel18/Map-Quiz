// Change entries of data object
const DataFix = data => {
  // Add missing country variants
  data.find(x => x.properties.alpha3Code === "COG").properties.spellings.push("Republic of the Congo");
  data.find(x => x.properties.alpha3Code === "COD").properties.spellings.push("Democratic Republic of the Congo");
  data.find(x => x.properties.alpha3Code === "GBR").properties.spellings.push("Britain");
  
  // Change display name of country to shorter variant
  data.find(x => x.properties.alpha3Code === "VEN").properties.name = "Venezuela";
  data.find(x => x.properties.alpha3Code === "BOL").properties.name = "Bolivia";
  data.find(x => x.properties.alpha3Code === "GBR").properties.name = "United Kingdom";
  data.find(x => x.properties.alpha3Code === "MDA").properties.name = "Moldova";
  data.find(x => x.properties.alpha3Code === "MKD").properties.name = "Macedonia";
  data.find(x => x.properties.alpha3Code === "PSE").properties.name = "Palestine";
  data.find(x => x.properties.alpha3Code === "SYR").properties.name = "Syria";
  data.find(x => x.properties.alpha3Code === "IRN").properties.name = "Iran";
  data.find(x => x.properties.alpha3Code === "PRK").properties.name = "North Korea";
  data.find(x => x.properties.alpha3Code === "KOR").properties.name = "South Korea";
  data.find(x => x.properties.alpha3Code === "LAO").properties.name = "Laos";
  data.find(x => x.properties.alpha3Code === "BRN").properties.name = "Brunei";
  data.find(x => x.properties.alpha3Code === "COD").properties.name = "DR Congo";
  data.find(x => x.properties.alpha3Code === "TZA").properties.name = "Tanzania";
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