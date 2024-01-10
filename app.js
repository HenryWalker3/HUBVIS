document.addEventListener('DOMContentLoaded', function() {
  loadData();

  var navbarSideCollapse = document.getElementById('navbarSideCollapse');
  var navbarSideMenu = document.getElementById('navbarSideMenu');
  var overlay = document.querySelector('.overlay');

  navbarSideCollapse.addEventListener('click', function () {
    navbarSideMenu.style.left = '0'; // Show side menu
    navbarSideMenu.classList.add('open'); // Add open class
    overlay.style.display = 'block'; // Show overlay
  });

  overlay.addEventListener('click', function () {
    navbarSideMenu.style.left = '-250px'; // Hide side menu
    navbarSideMenu.classList.remove('open'); // Remove open class
    overlay.style.display = 'none'; // Hide overlay
  });
});



const width = 1200;
const height = 600;



// **************************** MAIN VISUALISATION  ******************************************
function bubbleMapVisualisationAUS(ausTopoStates, ausTopoPostCodes, evanData) {
  // 00006165195343270469

  
  // Define the Mercator projection tailored for Australia
  const projection = d3.geoMercator()
  .fitSize([width, height], topojson.feature(ausTopoStates, ausTopoStates.objects.states));

  // Construct a path generator with the defined projection.
  const path = d3.geoPath().projection(projection);

  // Define zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 50])
    .on("zoom", zoomed);

  // Create the SVG container for the visualization.
  const svg = d3.select(".aus-visualisation-item")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .call(zoom);

  // Create a group for the map features and apply the zoom behavior.
  const g = svg.append("g");

  // Draw the states using the updated path generator.
  g.selectAll("path")
    .data(topojson.feature(ausTopoStates, ausTopoStates.objects.states).features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#444")
    .attr("stroke", "white")
    .attr("stroke-width", .1);

  // Construct the radius scale for the bubbles.
  const radius = d3.scaleSqrt()
  .domain([0, d3.max(evanData, d => d.value)]) // Use d.value to access the numeric value
  .range([0, 40]);

  // Assuming ausTopoPostCodes has separate keys for each state like state1, state2, etc.
  const allStatesKeys = Array.from({ length: 8 }, (_, i) => `state${i + 1}`);

  // Collecting all suburbs from each state
  const allSuburbs = allStatesKeys.flatMap(key => topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects[key]).features);

  // Map suburb names to their geographic features
  const suburbMap = new Map();
  allSuburbs.forEach(geo => {
    suburbMap.set(geo.properties.name, geo);
  });

  // Match Evan data with the geographic features
  const evanDataWithGeo = evanData.map(d => {
    const geoFeature = suburbMap.get(d.suburbName); // Make sure d.suburbName is correct
    return {
      value: d.value,
      geoFeature: geoFeature
    };
  }).filter(d => d.geoFeature); // Filter out entries without a matching feature

  // Draw circles for each data point
  const circles = g.selectAll("circle")
    .data(evanDataWithGeo)
    .join("circle")
    .attr("transform", d => {
      const centroid = path.centroid(d.geoFeature);
      return `translate(${centroid})`;
    })
    .attr("r", d => {
      const radiusSize = radius(d.value);
      return radiusSize;
    })
    .attr("fill", "rgb(37, 65, 214)")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 0.5)
    .append("suburbName");

  // Draw the suburbs/postcodes for all states
  // g.selectAll("path.suburb")
  //   .data(allSuburbs)
  //   .join("path")
  //   .attr("class", "suburb")
  //   .attr("d", path)
  //   .attr("fill", "none")
  //   .attr("stroke", "white")
  //   .attr("stroke-width", .5);

  // Optionally, add labels to each suburb/postcode for all states
  // g.selectAll("text.suburb-label")
  //   .data(allSuburbs)
  //   .join("text")
  //   .attr("class", "suburb-label")
  //   .attr("transform", d => `translate(${path.centroid(d)})`)
  //   .attr("text-anchor", "middle")
  //   .text(d => d.properties.name)
  //   .attr("font-size", "1px")
  //   .attr("fill", "white");

  // Zoom function to transform the group.
  function zoomed(event) {
    const transform = event.transform;
    g.attr("transform", transform);

    // Adjust stroke width based on zoom scale
    g.selectAll("path.suburb")
      .attr("stroke-width", 0.1 / transform.k); // Adjust the divisor as needed
  }
}





// **************************** AUS Bubble Map Interactive VISUALISAITON 1 ******************************************
function bubbleMapVisualisationAUS(ausTopoStates, ausTopoPostCodes, evanData) {
  // 00006165195343270469

  
  // Define the Mercator projection tailored for Australia
  const projection = d3.geoMercator()
  .fitSize([width, height], topojson.feature(ausTopoStates, ausTopoStates.objects.states));

  // Construct a path generator with the defined projection.
  const path = d3.geoPath().projection(projection);

  // Define zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 50])
    .on("zoom", zoomed);

  // Create the SVG container for the visualization.
  const svg = d3.select(".aus-visualisation-item")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .call(zoom);

  // Create a group for the map features and apply the zoom behavior.
  const g = svg.append("g");

  // Draw the states using the updated path generator.
  g.selectAll("path")
    .data(topojson.feature(ausTopoStates, ausTopoStates.objects.states).features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#444")
    .attr("stroke", "white")
    .attr("stroke-width", .1);

  // Construct the radius scale for the bubbles.
  const radius = d3.scaleSqrt()
  .domain([0, d3.max(evanData, d => d.value)]) // Use d.value to access the numeric value
  .range([0, 40]);

  // Assuming ausTopoPostCodes has separate keys for each state like state1, state2, etc.
  const allStatesKeys = Array.from({ length: 8 }, (_, i) => `state${i + 1}`);

  // Collecting all suburbs from each state
  const allSuburbs = allStatesKeys.flatMap(key => topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects[key]).features);

  // Map suburb names to their geographic features
  const suburbMap = new Map();
  allSuburbs.forEach(geo => {
    suburbMap.set(geo.properties.name, geo);
  });

  // Match Evan data with the geographic features
  const evanDataWithGeo = evanData.map(d => {
    const geoFeature = suburbMap.get(d.suburbName); // Make sure d.suburbName is correct
    return {
      value: d.value,
      geoFeature: geoFeature
    };
  }).filter(d => d.geoFeature); // Filter out entries without a matching feature

  // Draw circles for each data point
  const circles = g.selectAll("circle")
    .data(evanDataWithGeo)
    .join("circle")
    .attr("transform", d => {
      const centroid = path.centroid(d.geoFeature);
      return `translate(${centroid})`;
    })
    .attr("r", d => {
      const radiusSize = radius(d.value);
      return radiusSize;
    })
    .attr("fill", "rgb(37, 65, 214)")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 0.5)
    .append("suburbName");

  // Zoom function to transform the group.
  function zoomed(event) {
    const transform = event.transform;
    g.attr("transform", transform);

    // Adjust stroke width based on zoom scale
    g.selectAll("path.suburb")
      .attr("stroke-width", 0.1 / transform.k); // Adjust the divisor as needed
  }
}

// **************************** AUS Zoom Map VISUALISAITON 2 ******************************************
function createAUSMapVisualisation(aus) {
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
  document.getElementById("aus_dataviz").appendChild(svg.node());

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

// **************************** U.S. Bubble Map Interactive VISUALISAITON 1 ******************************************
function bubbleMapVisualisationUS(usStates, usCounties, population) {
  const path = d3.geoPath();

  // Define zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  // Create the SVG container for the visualization.
  const svg = d3.select(".us-visualisation-item")
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
    .attr("stroke-opacity", 0.5)
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

// **************************** U.S. Zoom Map VISUALISAITON 2 ******************************************
function createUSMapVisualisation(us) {
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
  document.getElementById("us_dataviz").appendChild(svg.node());

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
function loadData() {
  Promise.all([
    fetch('/US_JSON_Files/states-albers-10m.json').then(response => response.json()),
    fetch('/US_JSON_Files/counties-albers-10m.json').then(response => response.json()),
    fetch('/US_JSON_Files/population.json').then(response => response.json()),
    fetch('/AUS_JSON_Files/suburb-10.json').then(response => response.json()),
    fetch('/AUS_JSON_Files/au-states-geo.json').then(response => response.json()),
    fetch('/AUS_JSON_Files/au-states-topo.json').then(response => response.json()),
    d3.csv('/AUS_JSON_Files/evan_data.csv')
  ])
  .then(([usStates, usCounties, rawPopulationData, ausTopoSuburbs, ausGeoStates, ausTopoStates, rawEvanData]) => {
    const population = rawPopulationData
      .slice(1) // If there's a header
      .map(([p, state, county]) => ({
        state,
        fips: `${state}${county}`,
        population: +p
    }));

    // Processing Evan data from CSV
    const evanData = rawEvanData.map(d => {
      return {
        suburbName: d.suburbName.trim(),
        value: +d.value
      };
    });
    if (document.querySelector('.aus-visualisation-item')) {
      bubbleMapVisualisationAUS(ausTopoStates, ausTopoSuburbs, evanData);
    }
    if (document.getElementById('aus_dataviz')) {
      createAUSMapVisualisation(ausGeoStates);
    }
    if (document.getElementById('us_dataviz')) { // Ensure this element exists in your HTML
      createUSMapVisualisation(usStates);
    }
    bubbleMapVisualisationUS(usStates, usCounties, population);
  })
  .catch(error => {
    console.error('Could not load data', error);
  });
}
