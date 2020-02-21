// Draw Grand Mean Line
// initial line data
// final line data

grandMeanLineDatStart = [{ "startx": 0, "starty": grandMean, "endx": 0, "endy": grandMean }];
grandMeanLineDatEnd = [{ "startx": 0, "starty": grandMean, "endx": xMax, "endy": grandMean }];


linesToGrandMeanStartData = [];
linesToGrandMeanEndData = [];

for (let i = 0; i < plotData.length; i++) {
  let curr_x = plotData[i].x;
  let curr_y = plotData[i].y;
  linesToGrandMeanStartData.push(
    {
      xstart: curr_x,
      ystart: curr_y,
      xend: curr_x,
      yend: curr_y
    }
  )
}

for (let i = 0; i < plotData.length; i++) {
  let curr_x = plotData[i].x;
  let curr_y = plotData[i].y;
  linesToGrandMeanEndData.push(
    {
      xstart: curr_x,
      ystart: curr_y,
      xend: curr_x,
      yend: grandMean
    }
  )
}


let grandMeanLine = svg.append("g")
let grandMeanToggle = 0;
let linesToGranMean = svg.append("g")

let handleGrandMean = function () {  
  grandMeanToggle = grandMeanToggle + 1;
  if (grandMeanToggle % 2 == 1) {
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

    linesToGranMean.selectAll("line")
      .data(linesToGrandMeanStartData)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.xstart))
      .attr("y1", d => yScale(d.ystart))
      .attr("x2", d => xScale(d.xend))
      .attr("y2", d => yScale(d.yend))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

    linesToGranMean.selectAll("line")
      .data(linesToGrandMeanEndData)
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.xstart))
      .attr("y1", d => yScale(d.ystart))
      .attr("x2", d => xScale(d.xend))
      .attr("y2", d => yScale(d.yend))


  }

  else {
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


    linesToGranMean.selectAll("line")
      .data(linesToGrandMeanStartData)
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.xstart))
      .attr("y1", d => yScale(d.ystart))
      .attr("x2", d => xScale(d.xend))
      .attr("y2", d => yScale(d.yend))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

  }
}


