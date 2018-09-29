import React from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography, Markers } from "react-simple-maps"
import { Motion, spring } from "react-motion"
import ColorPicker from "./components/colorPicker.js"

const Map = ({ appthis }) => {
  let {
    defaultZoom,
    center,
    zoom,
    scale,
    dimensions,
    geographyPaths,
    disableOptimization,
    currentMap,
  } = appthis.state

  let rotation = currentMap === "oceania" ? [170, 0, 0] : [-10, 0, 0] ;
  return (
    <Motion
      defaultStyle={{
        zoom: defaultZoom,
        x: center[0],
        y: center[1],
      }}
      style={{
        zoom: spring(zoom, {stiffness: 210, damping: 20}),
        x: spring(center[0], {stiffness: 210, damping: 20}),
        y: spring(center[1], {stiffness: 210, damping: 20}),
      }}
    >
      {({zoom,x,y}) => (
        <div
          // ref={wrapper => appthis._wrapper = wrapper}
          // onDoubleClick={appthis.handleDoubleClick}
        >
          <ComposableMap
            projectionConfig={{ scale, rotation }}
            width={dimensions[0]}
            height={dimensions[1]}
            style={{
              width: "100%",
              height: "auto"
            }}
          >
            <ZoomableGroup
              center={[x,y]}
              zoom={zoom}
              // onMoveStart={appthis.handleMoveStart}
              // onMoveEnd={appthis.handleMoveEnd}
            >
              <Geographies geography={geographyPaths} disableOptimization={disableOptimization} >
                {(geographies, projection) => 
                  geographies.map((geography, i) => {
                  let [defaultColor, hoverColor, render] = ColorPicker(appthis.state, geography)
                  if (currentMap === "oceania") {
                    var key = `oceania-${i}`;
                    var cacheId = `oceania-${i}`;
                  } else {
                    key= `geography-${i}`
                    cacheId= `geography-${i}`
                  }
                  return render && (
                    <Geography
                      key={ key }
                      cacheId={ cacheId }
                      geography={ geography }
                      projection={ projection }
                      onClick={appthis.handleCountryClick}
                      fill="white"
                      stroke="black"
                      strokeWidth={ 0.05 }
                      style={{
                        default: {
                          fill : defaultColor,
                          transition: "fill .5s",
                        },
                        hover:   {
                          fill : hoverColor,
                          transition: "fill .5s",
                        },
                        pressed: {
                          fill : "rgb(105, 105, 105)",
                          transition: "fill .5s"
                        },
                      }}
                    />
                  )}
                )}
              </Geographies>
              <Markers>{ appthis.regionEllipses() }</Markers>
              <Markers>{ appthis.countryLabels() }</Markers>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      )}
    </Motion>
  )
}

export default Map
