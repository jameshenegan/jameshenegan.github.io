const w2 = 300, h2 = 300;
const svg2 = d3.select("#viz2")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 300 300");
  
const xScale2 = d3.scaleLinear()
  .domain([-1, 1])
  .range([padding, w2 - padding * 2]);
const yScale2 = d3.scaleLinear()
  .domain([-1, 1])
  .range([h2 - padding * 2, padding]);

svg2.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", w2)
  .attr("height", h2)
  .style("fill", "#221133")

// Create Tooltips
var tip2 = d3.tip().attr('class', 'd3-tip').direction('e').offset([0, 5])
  .html(function (d) {
    var content = `
                    <table style="margin-top: 2.5px;">
                            <tr><td style="text-align: right">` + (arrayOfKeys[d.index]) + `</td></tr>
                    </table>
                    `;
    return content;
  });
svg2.call(tip2);

svg2.selectAll("circle")
  .data(coordinates)
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return xScale2(d.u);
  })
  .attr("cy", function (d) {
    return yScale2(d.v);
  })
  .attr("r", 3)
  .style("fill", d => d.CodedContinent)
  .attr("stroke-width", 1)
  .attr("stroke", "black")
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);


  const handleScatterClick = function (globalIndex) {

    console.log(globalIndex);

  }

  svg2.selectAll("circle")
    .on("click", d => {
      globalIndex = d.index
      handleScatterClick(globalIndex);
    });

  const handleChange = function () {
      const slider1Val = document.getElementById("myRange").value
      globalSigma = slider1Val;
      console.log(globalSigma)
      handleClick(globalIndex);
    }
    
    d3.selectAll("#myRange")
      .on("input", handleChange)    


