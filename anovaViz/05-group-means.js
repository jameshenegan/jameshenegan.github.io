let observedSampleMeans = observedData.map(d => d.groupMean)
let groupMeanLineShift = 0.5/numberOfRepsPerTreatment

let sampleMeanDatStart = [];
let sampleMeanDatEnd = [];
for (let i = 0; i < observedSampleMeans.length; i++) {

  let current_object_start = {
    "startx": i + groupMeanLineShift ,
    "starty": observedSampleMeans[i],
    "endx": i + groupMeanLineShift,
    "endy": observedSampleMeans[i]
  }

  sampleMeanDatStart.push(current_object_start)
  let current_object_end = {
    "startx": i + groupMeanLineShift,
    "starty": observedSampleMeans[i],
    "endx": i + 1 + groupMeanLineShift,
    "endy": observedSampleMeans[i]
  }
  sampleMeanDatEnd.push(current_object_end)
}


linesToSampleMeansStart = [];
linesToSampleMeansEnd = [];

for (let i = 0; i < plotData.length; i++) {
  let curr_x = plotData[i].x;
  let curr_y = plotData[i].y;
  linesToSampleMeansStart.push(
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
    linesToSampleMeansEnd.push(
      {
        xstart: curr_x,
        ystart: curr_y,
        xend: curr_x,
        yend: observedfactorMeans2[i]
      }
    )
  }


  let sampleMeanLines = svg.append("g")
  let linesToSampleMeans = svg.append("g")
  
  
  let sampleMeansToggler = 0;
  



let handleSampleMeans = function () {  
  sampleMeansToggler = sampleMeansToggler + 1;
  if (sampleMeansToggler % 2 == 1) {
    sampleMeanLines.selectAll("line")
      .data(sampleMeanDatStart)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.startx))
      .attr("y1", d => yScale(d.starty))
      .attr("x2", d => xScale(d.endx))
      .attr("y2", d => yScale(d.endy))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

    sampleMeanLines.selectAll("line")
      .data(sampleMeanDatEnd)
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.startx))
      .attr("y1", d => yScale(d.starty))
      .attr("x2", d => xScale(d.endx))
      .attr("y2", d => yScale(d.endy))

      linesToSampleMeans.selectAll("line")
  .data(linesToSampleMeansStart)
  .enter()
  .append("line")
  .attr("x1", d => xScale(d.xstart))
  .attr("y1", d => yScale(d.ystart))
  .attr("x2", d => xScale(d.xend))
  .attr("y2", d => yScale(d.yend))
  .attr("stroke-width", 1)
  .attr("stroke", "black")

  linesToSampleMeans.selectAll("line")
  .data(linesToSampleMeansEnd)
  .transition()
  .duration(timerLength)
  .attr("x1", d => xScale(d.xstart))
  .attr("y1", d => yScale(d.ystart))
  .attr("x2", d => xScale(d.xend))
  .attr("y2", d => yScale(d.yend))
  } else{

    sampleMeanLines.selectAll("line")
      .data(sampleMeanDatStart)
      .transition()
      .duration(timerLength)
      .attr("x1", d => xScale(d.startx))
      .attr("y1", d => yScale(d.starty))
      .attr("x2", d => xScale(d.endx))
      .attr("y2", d => yScale(d.endy))
      .attr("stroke-width", 1)
      .attr("stroke", "black")

      linesToSampleMeans.selectAll("line")
      .data(linesToSampleMeansStart)
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


