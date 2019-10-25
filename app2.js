var svg = d3.select("svg");

svg.append("rect")
  .attr("height", 600)
  .attr("width", 460)
  .attr("fill", "rgb(115, 115, 115)")
  
var path = d3.geoPath(); // 
var colorScale = d3.scaleQuantize([0, 3.67], d3.schemeBlues[9])
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("final.csv").then((data, error) => {
  console.log(data)

  d3.json("https://d3js.org/us-10m.v1.json").then((us, error) => {

    if (error) throw error;

    var newData = us.objects.counties.geometries.filter(d => d.id > "28000" & d.id < "28164")
    var MS = us.objects.states.geometries.filter(d => d.id == "28")

    us.objects.counties.geometries = newData
    us.objects.states.geometries = MS
    delete (us.objects.nation)

    us.transform.scale = [0.047, 0.026]
    us.transform.translate = [-2870, -1590]

    console.log(us)

    var myFeatures = {}

    topojson.feature(us, us.objects.counties).features.forEach( (ue, ui) =>{
      data.forEach( (de, di) =>{
        if(ue.id !== de.FIPS){
          return null;
        }       

        myFeatures[ue.id] = [parseFloat(de.Count), de.County]
      })
    })

    console.log(myFeatures)

    var give = function(code){
      return code
    }

    
    
    svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", d => colorScale(Math.log(myFeatures[d.id][0]+ 1)))
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("County: "+myFeatures[d.id][1] +"<br>Count: "+myFeatures[d.id][0])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    svg.append("path")
      .attr("class", "county-borders")
      .attr("d", path(topojson.mesh(us, us.objects.counties, function (a, b) { return a !== b; })))
      ;

    svg.selectAll("path")
      .attr("transform", "rotate(3)")

  });

})

