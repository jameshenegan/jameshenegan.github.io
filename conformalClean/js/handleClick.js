const handleClick = function (stateIndex) {

  // state: which circle is centered      
  console.log("selected circle");
  console.log(stateIndex);

  // conditional on state: centers and radii of the circles

  var temp_u = coordinates[stateIndex].u;
  var temp_v = coordinates[stateIndex].v;

  var transformed_coordinates = coordinates.map((point) => {
    const newReA = RePsi(point.u, point.v, -temp_u, -temp_v);
    const newImA = ImPsi(point.u, point.v, -temp_u, -temp_v);
    const sigma = globalSigma;
    return { 'u': newReA, 'v': newImA, 'sigma': sigma, 'index': point.index };
  })

  console.log("transformed_coordinates");
  console.log(transformed_coordinates);

  const transformed_centersAndRadii = transformed_coordinates.map((point) => {
    const reC = getReC(point.u, point.v, globalSigma);
    const imC = getImC(point.u, point.v, globalSigma);
    const radius = getR(point.u, point.v, globalSigma);
    return { 'reC': round(reC), 'imC': round(imC), 'radius': round(radius), 'index': point.index };
  }
  )
  
  transformed_centersAndRadii.unshift({ 'reC': 0, 'imC': 0, 'radius': 1 });

  svg.selectAll("circle")
    .data(transformed_centersAndRadii)
    .transition()
    .duration(1000)
    .attr("cx", function (d) {
      return xScale(d.reC);
    })
    .attr("cy", function (d) {
      return yScale(d.imC);
    })
    .attr("r", function (d) {
      return xScale(d.radius) - xScale(0);
    });
}

svg.selectAll("circle")
  .on("click", d => {
    globalIndex = d.index
    handleClick(globalIndex);
  })

svg2.selectAll("circle")
  .on("click", d => {
    globalIndex = d.index
    handleClick(globalIndex);
  })
