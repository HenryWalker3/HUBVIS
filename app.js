const width = 1200;
const height = 600;

// **************************** FOR Zoom Map VISUALISAITON 2 ******************************************
// Carosel Visualisation_2
function createAUSMapVisualization(aus) {
  // Define projection
  const projection = d3.geoMercator()
                       .fitSize([width, height], aus);

  const path = d3.geoPath().projection(projection);

  // Define zoom behavior
  const zoom = d3.zoom()
                 .scaleExtent([1, 8])
                 .on("zoom", zoomed);

  // Create SVG
  const svg = d3.create("svg")
                 .attr("viewBox", [0, 0, width, height])
                 .attr("width", width)
                 .attr("height", height)
                 .attr("style", "max-width: 100%; height: auto;")
                 .on("click", reset);

  // Append groups for states
  const g = svg.append("g");
  const states = g.append("g")
                   .attr("fill", "#444")  // Matching fill color
                   .attr("cursor", "pointer")
                   .selectAll("path")
                   .data(aus.features) 
                   .join("path")
                   .on("click", clicked)
                   .attr("d", path);

  // Set titles for hovering
  states.append("title")
        .text(d => d.properties.STATE_NAME);

  // Drawing state borders
  aus.features.forEach(feature => {
    g.append("path")
      .attr("d", path(feature))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round");
  });

  // Attach zoom behavior
  svg.call(zoom);

  // Append SVG to the DOM
  document.getElementById("my_dataviz").appendChild(svg.node());

  // Reset function
  function reset() {
    states.transition().style("fill", null);
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
  }

  // Click function for zooming into a state
  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    states.transition().style("fill", null);
    d3.select(this).transition().style("fill", "rgb(37, 65, 214)");
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node()));
  }

  // Zoom behavior
  function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }
}


// **************************** Retriving data for ALL VISUALISATIONS ******************************************
Promise.all([
  fetch('australian-states.json').then(response => response.json()),
  fetch('counties-albers-10m.json').then(response => response.json()),
  fetch('population.json').then(response => response.json())
])
.then(([ausStates, usCounties, rawPopulationData]) => {
  const population = rawPopulationData
    .slice(1) // Remove the header line if present
    .map(([p, state, county]) => ({
      state,
      fips: `${state}${county}`,
      population: +p
    }));
  createAUSMapVisualization(ausStates);
})
.catch(error => {
  console.error('COULDNT GET FILE', error);
});