let xAxisTickLocations = [-3, -2, -1, 1, 2, 3]
    let xAxisTickHeight = 0.1

    for (let i = 0; i < xAxisTickLocations.length; i++) {
      axisGroup.append("line")
        .attr("x1", d => xScale(xAxisTickLocations[i]))
        .attr("y1", d => yScale(0))
        .attr("x2", d => xScale(xAxisTickLocations[i]))
        .attr("y2", d => yScale(xAxisTickHeight))
        .attr("stroke-width", 1)
        .attr("stroke", "white")
        .attr("opacity", axisOpacity)

    }

    let yAxisTickLocations = [-3, -2, -1, 1, 2, 3]
    let yAxisTickHeight = 0.1

    for (let i = 0; i < yAxisTickLocations.length; i++) {
      axisGroup.append("line")
        .attr("y1", d => yScale(yAxisTickLocations[i]))
        .attr("x1", d => xScale(0))
        .attr("y2", d => yScale(yAxisTickLocations[i]))
        .attr("x2", d => xScale(yAxisTickHeight))
        .attr("stroke-width", 1)
        .attr("stroke", "white")
        .attr("opacity", axisOpacity)

    }