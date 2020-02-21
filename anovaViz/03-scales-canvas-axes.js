let xMin = d3.min(plotData, d => d.x)
let xMax = d3.max(plotData, d => d.x)
let yMin = d3.min(plotData, d => d.y)
let yMax = d3.max(plotData, d => d.y)
let xPadding = 100;
let yPadding = 100;

let w = 500*1.618;
let h = 500;

const svg = d3.select("#viz")
  .append("svg")
  .attr("height", h)
  .attr("width", w);

const xScale = d3.scaleLinear()
  .domain([xMin, xMax])
  .range([0 + xPadding, w - xPadding]);

const yScale = d3.scaleLinear()
  .domain([0, yMax])
  .range([h - yPadding, 0 + yPadding]);

let myColorScale = d3.scaleOrdinal()
  .domain(observedData.map(d => d.treatment))
  .range(d3.schemeSet1);

let axisGroup = svg.append("g")

// add x axis
axisGroup.append("line")
  .attr("x1", d => xScale(0))
  .attr("y1", d => yScale(0))
  .attr("x2", d => xScale(xMax))
  .attr("y2", d => yScale(0))
  .attr("stroke-width", 1)
  .attr("stroke", "black")
  .attr("opacity", 0.5)

// add y axis
axisGroup.append("line")
  .attr("x1", d => xScale(0))
  .attr("y1", d => yScale(0))
  .attr("x2", d => xScale(0))
  .attr("y2", d => yScale(Math.round(yMax)))
  .attr("stroke-width", 1)
  .attr("stroke", "black")
  .attr("opacity", 0.5)

let yAxisTickLength = 0.1
// make y axis ticks
for (let i = 0; i <= Math.round(yMax); i++) {
  axisGroup.append("line")
    .attr("x1", d => xScale(0))
    .attr("y1", d => yScale(i))
    .attr("x2", d => xScale(-yAxisTickLength))
    .attr("y2", d => yScale(i))
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("opacity", 0.5)
}

let xAxisTickLength = 0.6
// make x axis ticks
for (let i = 0; i < numberOfTreatments; i++) {
  axisGroup.append("line")
    .attr("x1", d => xScale(listOfXMeans[i]))
    .attr("y1", d => yScale(0))
    .attr("x2", d => xScale(listOfXMeans[i]))
    .attr("y2", d => yScale(-xAxisTickLength))
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("opacity", 0.5)
}


let pointGroup = svg.append("g")
let indRadius = 5;

let newLines = svg.append("g")

pointGroup.selectAll("circle")
  .data(plotData)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.x))
  .attr("cy", d => yScale(d.y))
  .attr("r", d => indRadius)
  .attr("stroke-width", 1.75)
  .attr("stroke", "black")
  .style("fill", d => myColorScale(d.group))


let newPartToggle = 0

let handleNewPart = function () {  
  grandMeanToggle = grandMeanToggle + 1;
  newPartToggle = newPartToggle + 1;
  if (newPartToggle % 2 == 1) {
    pointGroup.selectAll("circle")
      .data(newPointDat)
      .transition()
      .duration(timerLength)
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 25)

    grandMeanLine.selectAll("line")
      .data(grandMeanLineDatStart)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.startx))
      .attr("y1", d => yScale(d.starty))
      .attr("x2", d => xScale(d.endx))
      .attr("y2", d => yScale(d.endy))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

    grandMeanLine.selectAll("line")
      .data(grandMeanLineDatEnd)
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.startx))
      .attr("y1", d => yScale(d.starty))
      .attr("x2", d => xScale(d.endx))
      .attr("y2", d => yScale(d.endy))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

      newLines.selectAll("line")
      .data(newLineEndDat)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.x1))
      .attr("y1", d => yScale(d.y2))
      .attr("x2", d => xScale(d.x2))
      .attr("y2", d => yScale(d.y2))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

      newLines.selectAll("line")
      .data(newLineEndDat)
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.x1))
      .attr("y1", d => yScale(d.y2))
      .attr("x2", d => xScale(d.x2))
      .attr("y2", d => yScale(d.y1))

  }

  else {
    pointGroup.selectAll("circle")
      .data(plotData)
      .transition()
      .duration(timerLength)
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", d => indRadius)

    grandMeanLine.selectAll("line")
      .data(grandMeanLineDatStart)
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.startx))
      .attr("y1", d => yScale(d.starty))
      .attr("x2", d => xScale(d.endx))
      .attr("y2", d => yScale(d.endy))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

      newLines.selectAll("line")
      .data(newLineEndDat)      
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.x1))
      .attr("y2", d => yScale(d.y2))
      .attr("x2", d => xScale(d.x2))
      .attr("y1", d => yScale(d.y2))
      .attr("stroke-width", 1)
      .attr("stroke", "black")
  }
}


