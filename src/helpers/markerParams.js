const labelPos = {
  "tl": {regions:["ABW", "VCT", "VGB"], coords:[-20,-20]},
  "tr": {regions:["TCA", "VGB", "SXM", "BLM", "ATG", "BRB", "DMA", "LCA", "AIA", "MAF", "MTQ", "BES"], coords:[20,-20]},
  "br": {regions:[], coords:[20,20]},
  "bl": {regions:["CYM", "VIR", "CUW", "GRD", "MSR", "KNA", "GLP" ], coords:[-20,20]},
}

const labelist = ["AIA", "MAF", "SXM", "BLM"];
const tinyCarib = ["tl", "tr", "br", "bl"]
  .map(pos => labelPos[pos].regions)
  .reduce((acc, val) => acc.concat(val), [])
const ellipseDim = {
  "FJI": { width: 13, height: 18, angle: 0 },
  "KIR": { width: 55, height: 23, angle: 0 },
  "MHL": { width: 11, height: 13, angle: 0 },
  "FSM": { width: 37, height: 9, angle: 10 },
  "MNP": { width: 2, height: 8, angle: 7 }, 
  "SLB": { width: 19, height: 8, angle: 27 },
  "VUT": { width: 4, height: 12, angle: -21 },
  "NCL": { width: 13, height: 10, angle: 0 },
  "TON": { width: 3, height: 9, angle: 20 },
  "PYF": { width: 30, height: 30, angle: 0 },
  "PCN": { width: 8, height: 5, angle: 0 },
}

function labelDist (x, y, alpha3Code, textAnchor) {
  let dx = x;
  let dy = y;

  Object.keys(labelPos).some(pos => {
    if(labelPos[pos].regions.includes(alpha3Code)){
      [dx, dy] = labelPos[pos].coords
      textAnchor = pos[1] === "r" ? "start":"end";

      return true
    }
    return false
  })

  if(labelist.includes(alpha3Code)) {
    let x = labelist.length - labelist.indexOf(alpha3Code);
    dx = (labelist.indexOf(alpha3Code) + 1) * 20;
    dy = dy * x;
  }

  return [dx, dy, textAnchor]
}

const labelAnchors = {
  "BLZ": "start",
  "CRI": "end",
  "GTM": "end",
  "HND": "start",
  "NIC": "start",
  "PAN": "start",
  "SLV": "end",
  "URY": "start",
  "GUY": "start",
  "SUR": "start",
  "GUF": "start",
  "SEN": "end",
  "GMB": "end",
  "GNB": "end",
  "GIN": "end",
  "SLE": "end",
  "LBR": "end",
  "STP": "end",
  "NAM": "end",
  "LSO": "start",
  "SWZ": "start",
  "MOZ": "start",
  "NOR": "end",
  "MKD": "start",
  "BGR": "start",
  "MNE": "end",
  "ITA": "end",
  "AZE": "start",
  "ISR": "end",
  "JOR": "start",
  "ARE": "start",
  "BHR": "end",
  "QAT": "start",
  "LBN": "end",
  "SYR": "start",
  "PSE": "end",
}

export { labelPos, labelist, ellipseDim, labelDist, tinyCarib, labelAnchors }