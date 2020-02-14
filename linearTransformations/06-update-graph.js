let updateGraph = function(a11, a12, a21, a22){
  newData = [];  

  for (let i = 0; i < data.length; i++) {
    new_x2 = a11 * data[i].x2 + a12 * data[i].y2;
    new_y2 = a21 * data[i].x2 + a22 * data[i].y2;
    newData.push({ 'x2': new_x2, 'y2': new_y2 })
  };  

  lineGroup.selectAll("line")
    .data(newData)
    .transition()
    .duration(transitionTime)
    .attr("x2", d => xScale(d.x2))
    .attr("y2", d => yScale(d.y2))

  return(newData);
}