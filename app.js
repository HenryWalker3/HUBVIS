

const width = 1200;
const height = 600;


// **************************** Bubble Map Interactive VISUALISAITON 1 ******************************************
function createIntegratedMapVisualization(usStates, usCounties, population) {
  // Construct a path generator.
  const path = d3.geoPath();

  // Define zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  // Create the SVG container for the visualization.
  const svg = d3.select(".visualisation-item")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; margin-left: 50px;")
    .call(zoom);

  // Create a group for the map features and apply the zoom behavior.
  const g = svg.append("g");

  // Draw the states.
  g.selectAll("path")
    .data(topojson.feature(usStates, usStates.objects.states).features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#444")
    .attr("stroke", "white");

  // Construct the radius scale for the bubbles.
  const radius = d3.scaleSqrt([0, d3.max(population, d => d.population)], [0, 40]);
  const countymap = new Map(topojson.feature(usCounties, usCounties.objects.counties).features.map(d => [d.id, d]));
  const data = population.map(d => ({
    ...d,
    county: countymap.get(d.fips)
  })).filter(d => d.county);

  g.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("transform", d => `translate(${path.centroid(d.county)})`)
    .attr("r", d => radius(d.population))
    .attr("fill", "rgb(37, 65, 214)")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .append("title")
    .text(d => {
      const countyName = d.county && d.county.properties ? d.county.properties.name : "Unknown";
      const stateName = d.state ? d.state : "Unknown";
      return `${countyName}, ${stateName}: ${d3.format(",")(d.population)}`;
    });
    // Zoom function to transform the group.
    function zoomed(event) {
      g.attr("transform", event.transform);
  }
}



  


// **************************** FOR Zoom Map VISUALISAITON 2 ******************************************
// Carosel Visualisation_2
function createUSMapVisualization(us) {
  // Define zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; margin-left: 50px;")
    .on("click", reset);

  const path = d3.geoPath();
  const g = svg.append("g");
  const states = g.append("g")
    .attr("fill", "#444")
    .attr("cursor", "pointer")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .join("path")
    .on("click", clicked)
    .attr("d", path);

  states.append("title") // Naming the states while hovering
    .text(d => d.properties.name);

  g.append("path")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

  svg.call(zoom);

  // Append the created SVG to the div with id 'my_dataviz'
  document.getElementById("my_dataviz").appendChild(svg.node());

  function reset() {
    states.transition().style("fill", null);
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
  }

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

  function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }
}





// **************************** Retriving data for ALL VISUALISATIONS ******************************************
Promise.all([
  fetch('states-albers-10m.json').then(response => response.json()),
  fetch('counties-albers-10m.json').then(response => response.json()),
  fetch('population.json').then(response => response.json())
])
.then(([usStates, usCounties, rawPopulationData]) => {
  const population = rawPopulationData
    .slice(1) // Remove the header line if present
    .map(([p, state, county]) => ({
      state,
      fips: `${state}${county}`,
      population: +p
    }));
  createIntegratedMapVisualization(usStates, usCounties, population);
  createUSMapVisualization(usStates);
  // createBubbleMap(usCounties, population);
})
.catch(error => {
  console.error('COULDNT GET FILE', error);
});





















// // **************************** FOR Bubble Map (static) VISUALISAITON 2 ******************************************
// function createBubbleMap(us, population) {

//   nation = topojson.feature(us, us.objects.nation)
//   statemap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]))
//   countymap = new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]))
//   statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)
  
//   // Join the geographic shapes and the population data.
//   const data = population.map((d) => ({
//     ...d,
//     county: countymap.get(d.fips),
//     state: statemap.get(d.state)
//   }))
//     .filter(d => d.county)
//     .sort((a, b) => d3.descending(a.population, b.population));

//   const radius = d3.scaleSqrt([0, d3.max(data, d => d.population)], [0, 40]);
//   const path = d3.geoPath();
//   const svg = d3.select(".visualisation-item");

//   svg.attr("width", 1200)
//      .attr("height", 600)
//      .attr("viewBox", [0, 0, 975, 610])
//      .attr("style", "width: 100%; height: auto; height: intrinsic;");

//   // Create the cartographic background layers.
//   svg.append("path")
//       .datum(topojson.feature(us, us.objects.nation))
//       .attr("fill", "#444")
//       .attr("d", path);

//   svg.append("path")
//       .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
//       .attr("fill", "none")
//       .attr("stroke", "white")
//       .attr("stroke-linejoin", "round")
//       .attr("d", path);

// // !!!!!!!!!!! CIRCLE LEGEND BOTTOM RIGHT !!!!!!!!!!!!!
//   // Create the legend.
//   const legend = svg.append("g")
//       .attr("fill", "#777")
//       .attr("transform", "translate(915,608)")
//       .attr("text-anchor", "middle")
//       .style("font", "10px sans-serif")
//     .selectAll()
//       .data(radius.ticks(4).slice(1))
//     .join("g");

//   legend.append("circle")
//       .attr("fill", "none")
//       .attr("stroke", "#ccc")
//       .attr("cy", d => -radius(d))
//       .attr("r", radius);

//   legend.append("text")
//       .attr("y", d => -2 * radius(d))
//       .attr("dy", "1.3em")
//       .text(radius.tickFormat(4, "s"));

// // !!!!!!!!!!! INFO HOVER EFFECT !!!!!!!!!!!!!
//   const format = d3.format(",.0f");
//   svg.append("g")
//       .attr("fill", "rgb(37, 65, 214)")
//       .attr("fill-opacity", 0.5)
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 0.5)
//     .selectAll()
//     .data(data)
//     .join("circle")
//       .attr("transform", d => `translate(${centroid(d.county)})`)
//       .attr("r", d => radius(d.population))
//     .append("title")
//       .text(d => `${d.county.properties.name}, ${d.state.properties.name}
//   ${format(d.population)}`);
  
//   function centroid(feature) {
//     return path.centroid(feature);
//   }
// // !!!!!!!!!!! CIRCLE OVERLAYER !!!!!!!!!!!!!
//   Plot.plot({
//     width: 975,
//     projection: "identity",
//     marks: [
//       Plot.geo(nation, { fill: "#eee" }),
//       Plot.geo(statemesh, { stroke: "white" }),
//       Plot.dot(population, Plot.centroid({r: "population", geometry: ({fips}) => countymap.get(fips)}))
//     ]
//   })
// }