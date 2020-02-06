const color2 = "#221133";
const color1 = "#aa11aa";

const w = 600, h = 600;
const svg = d3.select("#viz")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 600");
  

  

const round = function (input) {
  const magnitude = 10000000;
  return (Math.round(magnitude * input) / magnitude)
}
const abs = function (x, y) {
  return (Math.sqrt(x * x + y * y));
}
const square = function (x) {
  return (x * x);
}

// given a and sigma 
// a = u + iv
// get c = ReC + iImC
const getReC = function (u, v, sigma) {
  return (u * (1 - square(sigma)) / (1 - square(abs(u, v)) * square(sigma)))
}
const getImC = function (u, v, sigma) {
  return (v * (1 - square(sigma)) / (1 - square(abs(u, v)) * square(sigma)))
}
// get r 
const getR = function (u, v, sigma) {
  return (sigma * (1 - square(abs(u, v))) / abs(1 - square(abs(u, v)) * square(sigma), 0))
}


// Psi_a(z)
// z = x + iy
// a = u + iv           
const RePsi = function (x, y, u, v) {
  return (round((x + u * u * x - v * v * x + u * (1 + x * x + 2 * v * y + y * y)) / (1 + 2 * u * x + 2 * v * y + u * u * (x * x + y * y) + v * v * (x * x + y * y))))
};
const ImPsi = function (x, y, u, v) {
  return (round((y - u * u * y + v * v * y + v * (1 + x * x + 2 * u * x + y * y)) / (1 + 2 * u * x + 2 * v * y + u * u * (x * x + y * y) + v * v * (x * x + y * y))));
};

console.log("original coordaintes");
console.log(coordinates);

// sigma
var globalSigma = 0.03;

const original_centersAndRadii = coordinates.map((point) => {
  const reC = getReC(point.u, point.v, globalSigma);
  const imC = getImC(point.u, point.v, globalSigma);
  const radius = getR(point.u, point.v, globalSigma);
  return { 'reC': round(reC), 'imC': round(imC), 'radius': round(radius), 'index': point.index, 'CodedContinent': point.CodedContinent };
}
)

console.log("original centers and radii");
console.log(original_centersAndRadii)


// Create Tooltips
var tip = d3.tip().attr('class', 'd3-tip').direction('e').offset([0, 5])
  .html(function (d) {
    var content = `
                <table style="margin-top: 2.5px;">
                <tr><td style="text-align: right">` + (arrayOfKeys[d.index]) + `</td></tr>
                </table>
                `;
    return content;
  });
svg.call(tip);

original_centersAndRadii.unshift({ 'reC': 0, 'imC': 0, 'radius': 1 });

const padding = 30;
const xScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([padding, w - padding * 2]);
const yScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([h - padding * 2, padding]);

svg.append("circle")
  .attr("cx", xScale(0))
  .attr("cy", xScale(0))
  .attr("r", xScale(1) - xScale(0))
  .style("fill", color2);

svg.selectAll("circle")
  .data(original_centersAndRadii)
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return xScale(d.reC);
  })
  .attr("cy", function (d) {
    return yScale(d.imC);
  })
  .attr("r", function (d) {
    return xScale(d.radius) - xScale(0);
  })
  .style("fill", d => d.CodedContinent)
  .attr("stroke-width", 1)
  .attr("stroke", "black")
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

var globalIndex = 112;

