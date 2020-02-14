let lineGroup = svg.append("g")   

//arrow
svg.append("svg:defs").append("svg:marker")
  .attr("id", "triangle")
  .attr("refX", 6)
  .attr("refY", 6)
  .attr("markerWidth", 30)
  .attr("markerHeight", 30)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M 0 0 12 6 0 12 3 6")
  .style("fill", "white")
  .style("opacity", 0.6);

let myLines = lineGroup.selectAll("line")
  .data(data)
  .enter()
  .append("line")
  .attr("x1", d => xScale(d.x1))
  .attr("y1", d => yScale(d.y1))
  .attr("x2", d => xScale(d.x2))
  .attr("y2", d => yScale(d.y2))
  .attr("stroke-width", 0.75)
  .attr("stroke", d => d3.rgb(128, 100 * (d.x2 + lineLength)/(2*lineLength), 50 * (d.y2 + lineLength)))
  .attr("marker-end", "url(#triangle)");