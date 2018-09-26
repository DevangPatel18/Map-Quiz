const labelPos = {
  "tl": {regions:["ABW", "VCT", "VGB"], coords:[-20,-20]},
  "tr": {regions:["TCA", "VGB", "SXM", "BLM", "ATG", "BRB", "DMA", "LCA", "AIA", "MAF"], coords:[20,-20]},
  "br": {regions:[], coords:[20,20]},
  "bl": {regions:["CYM", "VIR", "CUW", "GRD", "MSR", "KNA" ], coords:[-20,20]},
}

const labelist = ["AIA", "MAF", "SXM", "BLM"];
const tinyCarib = ["ABW", "VCT", "VGB", "TCA", "VGB", "SXM", "BLM", "ATG", "BRB", "DMA", "LCA", "AIA", "MAF", "CYM", "VIR", "CUW", "GRD", "MSR", "KNA"]
const ellipseDim = {
  "FJI": { width: 13, height: 18, angle: 0 },
  "KIR": { width: 30, height: 20, angle: 0 },
  "MHL": { width: 11, height: 13, angle: 0 },
  "FSM": { width: 37, height: 9, angle: 10 },
  "MNP": { width: 2, height: 8, angle: 0 }, 
  "SLB": { width: 18, height: 8, angle: 27 },
  "VUT": { width: 5, height: 11.5, angle: -14 },
  "NCL": { width: 12, height: 10, angle: 0 },
  "TON": { width: 3, height: 9, angle: 20 }, 
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

export { labelPos, labelist, ellipseDim, labelDist, tinyCarib }