let axisGroup = svg.append("g")

let xAxisMin = -4
let xAxisMax = 4
let axisOpacity = 0.3

axisGroup.append("line")
.attr("x1", d => xScale(xAxisMin))
.attr("y1", d => yScale(0))
.attr("x2", d => xScale(xAxisMax))
.attr("y2", d => yScale(0))
.attr("stroke-width", 1)
.attr("stroke", "white")
.attr("opacity", axisOpacity)

let yAxisMin = -4
let yAxisMax = 4

axisGroup.append("line")
.attr("x1", d => xScale(0))
.attr("y1", d => yScale(yAxisMin))
.attr("x2", d => xScale(0))
.attr("y2", d => yScale(yAxisMax))
.attr("stroke-width", 1)
.attr("stroke", "white")
.attr("opacity", axisOpacity)