function makeResponsive() {
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

  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("../assets/data/data.csv")
    .then(function (censusData) {
      console.log(censusData);
      censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

      var xLinearScale = d3
        .scaleLinear()
        .domain([8, d3.max(censusData, (d) => d.poverty)])
        .range([0, width]);

      var yLinearScale = d3
        .scaleLinear()
        .domain([0, d3.max(censusData, (d) => d.healthcare)])
        .range([height, 0]);

      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      chartGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g").call(leftAxis);

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

      var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .style("font-size", "12px")
        .offset([80, -60])
        .html(function (d) {
          return `<strong>${d.state}<strong><hr>${d.poverty}`;
        });

      chartGroup.call(toolTip);

      circlesGroup
        .on("mouseover", function (d) {
          toolTip.show(d, this);
        })
        .on("mouseout", function (d, index) {
          toolTip.hide(d);
        });

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

makeResponsive();
