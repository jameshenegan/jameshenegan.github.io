 // Make Canvas 

 let transitionTime = 3000;

 var w = 600;
 var h = 600;
 var svg = d3.select("#viz")
   .append("svg")
   .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 600")
    .attr("class", "z-depth-1")

 svg.append("rect")
   .attr("x", 0)
   .attr("y", 0)
   .attr("width", w+100)
   .attr("height", h+100)
