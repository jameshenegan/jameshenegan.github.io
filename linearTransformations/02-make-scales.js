minX = -4;
maxX = 4;

minY = -4;
maxY = 4;

const xScale = d3.scaleLinear()
  .domain([minX, maxX])
  .range([0, w]);

const yScale = d3.scaleLinear()
  .domain([minY, maxY])
  .range([h, 0]);