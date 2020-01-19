/*
	Margins, Canvas, Graph
	Transition Function
	Path
	Axes Labels
	Scales
	Axes
	Add Event Listeners
	jQuery UI Slider
	Load Data
		-restructure data
		-call the update function for the first time
	Define the Update Function

*/

// Margins, Canvas, Graph
const margin = { left: 100, right: 100, top: 50, bottom: 100 },
	height = 500 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right

const svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)

const g = svg.append("g")
	.attr("transform", `translate( ${margin.left}, ${margin.top} )`);

// Define a transition function
const t = () => { return d3.transition().duration(1000) }

const parseTime = d3.timeParse("%Y")
const formatTime = d3.timeFormat("%Y");
const bisectDate = d3.bisector((d) => d.date).left

// Define path so that we can update it later on
g.append("path")
	.attr("class", "line")
	.attr("fill", "none")
	.attr("stroke", "grey")
	.attr("stroke-width", "3px")

// Axes Labels
const xLabel = g.append("text")
	.attr("class", "x axisLabel")
	.attr("y", height + 50)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Year")

const yLabel = g.append("text")
	.attr("class", "y axisLabel")
	.attr("transform", "rotate(-90)")
	.attr("y", -70)
	.attr("x", -190)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Amount")

// Scales	
const x = d3.scaleTime().range([0, width])
const y = d3.scaleLinear().range([height, 0])

// Axes
const xAxisCall = d3.axisBottom().ticks(10)
const xAxis = g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${height})`)

const yAxisCall = d3.axisLeft()
const yAxis = g.append("g").attr("class", "y axis")


// Event listeners
// Event listeners
$("#resource-select").on("change", update)
$("#var-select").on("change", update)

// Add jQuery UI slider
$("#date-slider").slider({
	range: true,
	max: parseTime("2018").getTime(),
	min: parseTime("1951").getTime(),
	step: 1, // One day
	values: [parseTime("1951").getTime(), parseTime("2018").getTime()],
	slide: function (event, ui) {
		$("#dateLabel1").text(formatTime(new Date(ui.values[0])));
		$("#dateLabel2").text(formatTime(new Date(ui.values[1])));
		update();
	}
});

// Load Data
d3.json("data/ms.json").then((data) => {
	console.log(data);

	reStructuredData = {}

	for (var resource in data) {
		if (!data.hasOwnProperty(resource)) {
			continue;
		}
		reStructuredData[resource] = data[resource].filter((d) => {
			return !(d["Value"] == null)
		})

		reStructuredData[resource].forEach((d) => {
			d["Value"] = +d["Value"];
			d["Year"] = parseTime(d["Year"])
		})
	}


	update();
})

function update() {

	//  get selected resource and slider values
	const resource = document.getElementById("resource-select").value,
		sliderValues = $("#date-slider").slider("values")

	// filter the data according to slider values
	const dataTimeFiltered = reStructuredData[resource].filter((d) => {
		return ((d.Year >= sliderValues[0]) && (d.Year <= sliderValues[1]))
	});

	// update domains and axes
	x.domain(d3.extent(dataTimeFiltered, (d) => d.Year))
	y.domain([0,
		d3.max(dataTimeFiltered, (d) => d["Value"]) * 1.005])

	xAxisCall.scale(x);
	xAxis.transition(t()).call(xAxisCall)
	yAxisCall.scale(y);
	yAxis.transition(t()).call(yAxisCall)

	// update line
	line = d3.line()
		.x(d => x(d.Year))
		.y(d => y(d["Value"]))

	g.select(".line")
		.transition(t)
		.attr("d", line(dataTimeFiltered));
};
