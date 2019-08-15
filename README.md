
## [Map Quiz](https://objective-ramanujan-b71cd2.netlify.com/)

Map Quiz is a website that allows users to view country information and quiz themselves on country names, capitals, and their flags for different parts of the globe. It was built using Create React App and utilizes several tools, including the Rest Countries API, React-Simple-Maps library, and components from Semantic-UI-React. It serves as an educational tool for anyone who wishes to improve their geography knowledge.

## Features

- Full map includes 248 regions which include sovereign countries and their dependencies.
- Clicked regions display the associated flag, name, capital, population, area, and whether or not it's a region of a sovereign entity.
- Each map view features 5 different quizzes.
  - Click quizzes involve clicking the appropriate area given the country name, capital, or flag.
  - Type quizzes require a typed response for the respective country name or capital of the highlighted region.
- Quizzes employ a timer which can be paused and resumed at the user's convenience.
- All region views feature a country dropdown to immediately zoom to selected country and display their information.
- All region views (except for "World") feature toggles to view text labels for each country's name or capital.

## Built With

- [Create React App](https://github.com/facebook/create-react-app) - Development environment
- [React-Simple-Maps](https://github.com/zcreativelabs/react-simple-maps/) - Used for rendering map
- [Semantic-UI-React](https://react.semantic-ui.com/) - Components for user interface

## Data Sources

- [Rest Countries API](https://restcountries.eu/) - Used for fetching country data
- [World Atlas TopoJSON](https://github.com/topojson/world-atlas) - GeoJSON for world map
- [Country GeoJSON Collection](https://github.com/LonnyGomes/CountryGeoJSONCollection) - GeoJSON for individual regions
- [Techslides](http://techslides.com/list-of-countries-and-capitals) - Capital Coordinates
- [The World Bank](https://www.worldbank.org/) - Population Data
