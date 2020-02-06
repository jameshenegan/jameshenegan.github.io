const handleSlider = function () {
  const slider1Val = document.getElementById("myRange").value
  
  var localSigma = slider1Val * 100;

  globalSigma = slider1Val;

  svg2.selectAll("circle")    
    .attr("r", localSigma);

    handleSlider2(globalIndex);
}

d3.selectAll("#myRange")
  .on("input", handleSlider);
