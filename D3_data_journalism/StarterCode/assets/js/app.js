
var svgWidth = 1200;
var svgHeight = 700;

var margin = {
  top: 50,
  right: 100,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;
// console.log(healthData)


// Parse Data
  healthData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

// Create scale functions
  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 0]);

// Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  xMin = d3.min(healthData, function(data) {
      return data.income;
  });
  
  xMax = d3.max(healthData, function(data) {
      return data.income;
  });
  
  yMin = d3.min(healthData, function(data) {
      return data.obesity;
  });
  
  yMax = d3.max(healthData, function(data) {
      return data.obesity;
  });
  
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);
  console.log(xMin);
  console.log(yMax);

// Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

// Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.income + 300))
  .attr("cy", d => yLinearScale(d.obesity + 0.1))
  .attr("r", "12")
  .attr("fill", "steelblue")
  .attr("opacity", .5)

  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

  // Tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (abbr + '%');
      });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // Mouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.income);
      })
      .attr("y", function(data) {
          return yLinearScale(data.obesity);
      })
      .text(function(data) {
          return data.abbr
      });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)");
    

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
    .attr("class", "axisText")
    .text("Income ($)");
});
