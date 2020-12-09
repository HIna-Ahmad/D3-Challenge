// You need to create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

// Using the D3 techniques we taught you in class, create a scatter plot that represents each state with circle elements. You'll code this graphic in the `app.js` file of your homework directory—make sure you pull in the data from `data.csv` by using the `d3.csv` function. Your scatter plot should ultimately appear like the image at the top of this section.

// - Include state abbreviations in the circles.

// - Create and situate your axes and labels to the left and bottom of the chart.

// - Note: You'll need to use `python -m http.server` to run the visualization. This will host the page at `localhost:8000` in your web browser.

// The code for scatter plot is wrapped in this function
function makeResponsive() {
  // SVG wrapper dimensions are determined width and height below
  var svgWidth = 1000;
  var svgHeight = 500;

  var margin = {
    top: 30,
    right: 40,
    bottom: 60,
    left: 100,
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append group element
  var chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
  d3.csv("data.csv")
    .then(function (censusData) {
      console.log(censusData);
      //Parse
      censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

      // Create Scale Functions
      var xLinearScale = d3
        .scaleLinear()
        .domain([8, d3.max(censusData, (d) => d.poverty)])
        .range([0, width]);

      var yLinearScale = d3
        .scaleLinear()
        .domain([0, d3.max(censusData, (d) => d.healthcare)])
        .range([height, 0]);

      // Create Axis Functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // Append Axes to the Scatter Plot
      chartGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g").call(leftAxis);

      // Append Circles
      var circlesGroup = chartGroup
        .selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xLinearScale(d.poverty))
        .attr("cy", (d) => yLinearScale(d.healthcare))
        .attr("r", (d) => d.healthcare)
        .attr("fill", "yellow")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("opacity", ".5");

      chartGroup
        .selectAll(null)
        .data(censusData)
        .enter()
        .append("text")
        .text((d) => d.abbr)
        .attr("x", function (d) {
          return xLinearScale(d.poverty);
        })
        .attr("y", function (d) {
          return yLinearScale(d.healthcare);
        })
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

      // Initialize Tooltip
      var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .style("font-size", "12px")
        .offset([80, -60])
        .html(function (d) {
          return `<strong>${d.state}<strong><hr>${d.poverty}`;
        });

      // Create Tooltip in chartGroup
      chartGroup.call(toolTip);

      // Create Mouseover Event Listener to display Tooltip
      circlesGroup
        .on("mouseover", function (d) {
          toolTip.show(d, this);
        })

        // Create Mouseout Event Listening to hide Tooltop
        .on("mouseout", function (d, index) {
          toolTip.hide(d);
        });

      // Create Axes Labels
      chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("HEALTHCARE");

      chartGroup
        .append("text")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top + 30})`
        )
        .attr("class", "axisText")
        .text("POVERTY");
    })
    .catch(function (error) {
      console.log(error);
    });
}
// When the browser loads, function is called
makeResponsive();
