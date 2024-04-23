const width = 1200;
const height = 600;
let evanData, tonyData, ruixingData, censusData, ausTopoStates, ausTopoSuburbs, ausGeoStates, ausTopoPostCodes; // Declare ausTopoPostCodes here
let census1, census2, census3, census4, census5, census6, census7, census8, census9, census10, census11, census12;
const isHeatmapPage = window.location.href.includes('heatmap.html');

document.addEventListener('DOMContentLoaded', function() {
  populateAdditionalSelectors();
  
  const isHeatmapPage = window.location.href.includes('heatmap.html');
  // If on heatmap.html, hide or remove the "Postcodes" slider
  if (isHeatmapPage) {
    const postcodesSliderContainer = document.querySelector('.map-toggle');
    if (postcodesSliderContainer) {
      postcodesSliderContainer.style.display = 'none'; // Hide the slider container
    }
  }


  adjustVisibilityForSelectedVisualization();

  document.getElementById('bubbleMap').addEventListener('change', function() {
    adjustVisibilityForSelectedVisualization();
  });
  document.getElementById('choroplethMap').addEventListener('change', function() {
    adjustVisibilityForSelectedVisualization();
  });

  loadData().then(() => {
    document.querySelectorAll("input[name='dataset']").forEach(input => {
      input.addEventListener('change', function() {
          if (this.value === 'evan') {
            currentSelectedData  = evanData;
          } else if (this.value === 'Henry' || this.value === 'Siarra' || this.value === 'Ruixing' || this.value === 'Toluwa'
          || this.value === 'Newton'|| this.value === 'Jamie'|| this.value === 'Tony'|| this.value === 'Matt') {
            currentSelectedData = (this.value === 'tony' ? tonyData : this.value === 'henry' ? henryData : newtonData);
            highlightRandomSuburb(currentSelectedData); // This is the new function to implement
          } else if (this.value === 'tony') {
            currentSelectedData  = tonyData;
          } else if (this.value === 'ruixing') {
            currentSelectedData  = ruixingData;
          } else if (this.value === 'value1') {
            currentSelectedData  = census1;
          } else if (this.value === 'value2') {
            currentSelectedData  = census2;
          } else if (this.value === 'value3') {
            currentSelectedData  = census3;
          } else if (this.value === 'value4') {
            currentSelectedData  = census4;
          } else if (this.value === 'value5') {
            currentSelectedData  = census5;
          } else if (this.value === 'value6') {
            currentSelectedData  = census6;
          } else if (this.value === 'value7') {
            currentSelectedData  = census7;
          } else if (this.value === 'value8') {
            currentSelectedData  = census8;
          } else if (this.value === 'value9') {
            currentSelectedData  = census9;
          } else if (this.value === 'value10') {
            currentSelectedData  = census10;
          } else if (this.value === 'value11') {
            currentSelectedData  = census11;
          } else if (this.value === 'value12') {
            currentSelectedData  = census12;
          } 
          // Use currentSelectedData to update the visualization...
          mapVisualisationAUS(ausTopoStates, ausTopoPostCodes, currentSelectedData);
      });
    });
      document.querySelectorAll("input[name='visualizationType']").forEach(input => {
          input.addEventListener('change', function() {
              mapVisualisationAUS(ausTopoStates, ausTopoPostCodes, currentSelectedData);
      });
      document.querySelectorAll("input[name='ausData']").forEach(radio => {
        radio.addEventListener('change', function(event) {
          if (this.checked) {
            loadDataForDataPoint(this.value);
          }
        });
      });
  });
  
  }).catch(error => {
      console.error('Error in data loading or event listeners setup:', error);
  });
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
  document.getElementById('investor').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("additional-investors").style.display = "block";
        document.getElementById("additional-advisors").style.display = "none"; // Hide Advisor names
    }
});

document.getElementById('advisor').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("additional-advisors").style.display = "block";
        document.getElementById("additional-investors").style.display = "none"; // Hide Investor names
    }
});
});

function highlightRandomSuburb(data) {
  // Assume data is an array of objects each with a 'suburbName' and other properties
  console.log("HIT!");
  const randomIndex = Math.floor(Math.random() * data.length);
  const suburbToHighlight = data[randomIndex].suburbName;
  
  // Assuming function to update map visualization
  // This function should set the color of the selected suburb to bright orange
  updateSuburbColorOnMap(suburbToHighlight, 'brightOrange');
}

// New function to adjust visibility based on selected visualization
function adjustVisibilityForSelectedVisualization() {
  if (document.getElementById('bubbleMap').checked) {
    // Show elements related to bubbleMap and hide unrelated ones
    toggleVisibility(['.dataset-toggle'], ['.role-toggle']);
  } else if (document.getElementById('choroplethMap').checked) {
    // Adjust for choroplethMap
    toggleVisibility(['.role-toggle'], ['.dataset-toggle']);
  } else {
    // Default state or other visualizations
    toggleVisibility(['.dataset-toggle', '.role-toggle'], []); // Assume all should be shown by default or adjust as needed
  }

  // Ensure benchmarking options are always visible, if this is a requirement
  document.querySelectorAll('.benchmarking-options').forEach(el => el.style.display = 'block');
}

// Adjusted toggleVisibility function to correctly handle showing/hiding elements
function toggleVisibility(showSelectors, hideSelectors) {
  // Show elements
  showSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.style.display = 'block');
  });
  // Hide elements
  hideSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
  });
}

function loadDataForDataPoint(dataPointKey) {
  // Check if the necessary TopoJSON data is defined
  if (!ausTopoPostCodes || !ausTopoPostCodes.objects || !Object.keys(ausTopoPostCodes.objects).length) {
    console.error('TopoJSON data is not properly defined.');
    return;
  }

  // Fetch and process CSV data for the selected data point
  d3.csv('/AUS_JSON_Files/aus-gov-postcode-data-sorted-EDITED.csv').then(data => {
    // Example of processing CSV data
    const filteredData = data.map(d => ({
      postcode: d['Postcode'],
      value: +d[dataPointKey] // Make sure the column names match your CSV file
    }));

    // Update the visualization with the filteredData
    // E.g., mapVisualisationAUS(ausTopoStates, ausTopoPostCodes, filteredData);
  }).catch(error => {
    console.error('Error loading CSV data for data point: ', dataPointKey, error);
  });
}

function generateRandomNames() {
  const names = ["Henry", "Siarra", "Ruixing", "Toluwa", "Newton", "Jamie", "Tony", "Matt"];
  let selectedNames = [];
  while (selectedNames.length < 3) {
    const randomIndex = Math.floor(Math.random() * names.length);
    const name = names[randomIndex];
    if (!selectedNames.includes(name)) {
      selectedNames.push(name);
    }
  }
  return selectedNames;
}

function populateAdditionalSelectors() {
  const investorsNames = generateRandomNames(); // Keep random names for investors
  const advisorsNames = ["Evan", "Natasha"]; // Set fixed names for advisors

  populateOptions("additional-investors", investorsNames, "additionalInvestor");
  populateOptions("additional-advisors", advisorsNames, "additionalAdvisor");
}

function populateOptions(containerId, names, inputName) {
  const container = document.getElementById(containerId);
  if (container === null) {
      console.error(`Element with ID '${containerId}' not found.`);
      return; // Exit the function to avoid attempting to set properties on null
  }

  container.innerHTML = ''; // Proceed if the element exists

  names.forEach(name => {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = inputName;
    input.value = name;
    input.id = `${inputName}-${name.toLowerCase().replace(/\s+/g, '-')}`; // Ensuring unique ID

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = name;

    container.appendChild(input);
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });
}

// **************************** MAIN VISUALISATION  ******************************************
function mapVisualisationAUS(ausTopoStates, ausTopoPostCodes, selectedData) {
  const isHeatmapPage = window.location.href.includes('heatmap.html'); // Check if on heatmap.html
  visualizationType = document.querySelector('input[name="visualizationType"]:checked')?.value;
  
  const svg = d3.select(".aus-visualisation-item")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  svg.selectAll("*").remove(); // This line clears the SVG
  let projection, path;

  if (!visualizationType) {
      visualizationType = 'bubble';
  }

  if (visualizationType === 'bubble') {
    // 00006165195343270469
    const zoom = d3.zoom()
      .scaleExtent([1, 50])
      .on("zoom", zoomed);

    if (isHeatmapPage) {
        const actFeatures = topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects.state8);
        projection = d3.geoMercator().fitSize([width, height], actFeatures);
      } else {
        projection = d3.geoMercator().fitSize([width, height], topojson.feature(ausTopoStates, ausTopoStates.objects.states));
      }

      path = d3.geoPath().projection(projection);
      svg.call(zoom);

      const g = svg.append("g");

      if (isHeatmapPage) {
        const actFeatures = topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects.state8).features;
        g.selectAll("path")
          .data(actFeatures)
          .enter().append("path")
          .attr("d", path)
          .attr("fill", "#444")
          .attr("stroke", "white")
          .attr("stroke-width", .1);
      } else {
        g.selectAll("path")
          .data(topojson.feature(ausTopoStates, ausTopoStates.objects.states).features)
          .enter().append("path")
          .attr("d", path)
          .attr("fill", "#444")
          .attr("stroke", "white")
          .attr("stroke-width", .1);
      }
    
    const radius = d3.scaleSqrt()
    .domain([0, d3.max(selectedData, d => d.value)]) // Use d.value to access the numeric value
    .range([0, 30]);

    let allStatesKeys = ['state8']; // Default to only NSW
    if (!isHeatmapPage) {
        allStatesKeys = Array.from({ length: 8 }, (_, i) => `state${i + 1}`);
    }

    const allSuburbs = allStatesKeys.flatMap(key => topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects[key]).features);
    const suburbMap = new Map();
    allSuburbs.forEach(geo => {
      suburbMap.set(geo.properties.name, geo);
    });

    const selectedDataWithGeo = selectedData.map(d => {
      const geoFeature = suburbMap.get(d.suburbName); // Make sure d.suburbName is correct
      return {
        value: d.value,
        geoFeature: geoFeature
      };
    }).filter(d => d.geoFeature); // Filter out entries without a matching feature

    g.selectAll("circle")
      .data(selectedDataWithGeo)
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
      .attr("fill-opacity", 0.3)
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 0.5)
      .append("suburbName");

    g.selectAll("path.suburb")
      .data(allSuburbs)
      .join("path")
      .attr("class", "suburb")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", .5);

    const suburbPaths = g.selectAll("path.suburb")
      .data(allSuburbs)
      .join("path")
      .attr("class", "suburb")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .style("display", "none"); // Initially hide the suburb paths

    const suburbZoomThreshold = 15; // Adjust this value as needed
    function zoomed(event) {
      const transform = event.transform;
      g.attr("transform", transform);
      const isSuburbVisible = document.getElementById("suburbToggle").checked;
      const suburbFadeStartZoom = 10; // Zoom level at which suburb paths start fading in

      if (isSuburbVisible) {
        const opacityScale = d3.scaleLinear()
        .domain([suburbFadeStartZoom, suburbZoomThreshold])
        .range([0, 1])
        .clamp(true);
        const suburbOpacity = opacityScale(transform.k);
        suburbPaths.style("opacity", suburbOpacity)
        .style("display", suburbOpacity > 0 ? null : "none");
        
        g.selectAll("path.suburb")
            .attr("stroke-width", 0.1 / transform.k);
        }

      const zoomScale = transform.k;
      const maxZoomScale = 5;
      const captionOpacity = Math.max(0, 1 - Math.pow(zoomScale / maxZoomScale, 2));
      d3.select("#caption-title").style("opacity", captionOpacity);
      d3.select("#caption-text").style("opacity", captionOpacity);

      const newRadiusScale = radius.copy().range([0, 30 / transform.k]);
      g.selectAll("circle")
          .attr("r", d => newRadiusScale(d.value))
          .attr("stroke-width", 0.5 / transform.k);

    }
    document.getElementById("suburbToggle").addEventListener("change", function() {
      zoomed({ transform: d3.zoomTransform(svg.node()) });
    });
  } else if (visualizationType === 'choropleth') {
    createChoroplethMap(ausTopoStates, ausTopoPostCodes, selectedData);
  } else if (visualizationType.startsWith('value')) {
    createChoroplethMap(ausTopoStates, ausTopoPostCodes, selectedData);
  } else {
      console.error("Invalid visualization type: ", visualizationType);
  }
}

function createChoroplethMap(ausTopoStates, ausTopoPostCodes, selectedData) {
  const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip') // Make sure to define this class in your CSS
  .style('opacity', 0)
  .style('position', 'absolute')
  .style('background-color', 'white')
  .style('border', 'solid')
  .style('border-width', '1px')
  .style('border-radius', '5px')
  .style('padding', '5px')
  .style('pointer-events', 'none'); // To ensure mouse events are passed to underlying elements

  d3.select(".aus-visualisation-item").selectAll("*").remove();

  let projection;
  if (isHeatmapPage) {
    const actFeatures = topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects.state8);
    projection = d3.geoMercator().fitSize([width, height], actFeatures);
  } else {
    projection = d3.geoMercator().fitSize([width, height], topojson.feature(ausTopoStates, ausTopoStates.objects.states));
  }
  const path = d3.geoPath().projection(projection);
  const zoom = d3.zoom()
    .scaleExtent([1, 100]) // Increased the max scale for closer zoom
    .on("zoom", zoomed);
  
    const svg = d3.select(".aus-visualisation-item")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .call(zoom);

  const g = svg.append("g");
  const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(selectedData, d => d.value)]);
  const valueMap = new Map(selectedData.map(d => [d.suburbName, d.value]));
  const keysToProcess = isHeatmapPage ? ['state8'] : Array.from({ length: 8 }, (_, i) => `state${i + 1}`);

  keysToProcess.forEach(key => {
    const stateFeatures = topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects[key]).features;

    g.selectAll(`path.${key}`)
    .data(stateFeatures)
    .enter().append("path")
    .attr("class", `${key}`)
    .attr("d", path)
    .attr("fill", d => {
        const suburbName = d.properties.name;
        const value = valueMap.get(suburbName);
        return value ? colorScale(value) : '#444';
    })
    .attr("stroke", "white")
    .attr("stroke-width", 0.005)
    .attr("stroke-width", isHeatmapPage ? ".1px" : "0.05")

    .on('mouseover', (event, d) => {
        tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip.html(`Suburb: ${d.properties.name}<br>Value: ${valueMap.get(d.properties.name)}`)
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });
  });



  function zoomed(event) {
    g.attr("transform", event.transform);

    // Directly integrate the logic to adjust text opacity based on zoom
    const maxZoomScaleForText = 5; // Define your own threshold for fading out the text
    const captionOpacity = Math.max(0, 1 - Math.pow(event.transform.k / maxZoomScaleForText, 2));

    d3.select("#caption-title").style("opacity", captionOpacity);
    d3.select("#caption-text").style("opacity", captionOpacity);
  }
}

// **************************** AUS Bubble Map Interactive VISUALISAITON 1 ******************************************
function bubbleMapVisualisationAUS(ausTopoStates, ausTopoPostCodes, evanData) {
  const projection = d3.geoMercator()
  .fitSize([width, height], topojson.feature(ausTopoStates, ausTopoStates.objects.states));
  const path = d3.geoPath().projection(projection);
  const zoom = d3.zoom()
    .scaleExtent([1, 50])
    .on("zoom", zoomed);

  const svg = d3.select(".aus-visualisation-item2")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .call(zoom);

  const g = svg.append("g");

  g.selectAll("path")
    .data(topojson.feature(ausTopoStates, ausTopoStates.objects.states).features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#444")
    .attr("stroke", "white")
    .attr("stroke-width", .1);

  const radius = d3.scaleSqrt()
  .domain([0, d3.max(evanData, d => d.value)]) // Use d.value to access the numeric value
  .range([0, 40]);

  const allStatesKeys = Array.from({ length: 8 }, (_, i) => `state${i + 1}`);
  const allSuburbs = allStatesKeys.flatMap(key => topojson.feature(ausTopoPostCodes, ausTopoPostCodes.objects[key]).features);
  const suburbMap = new Map();
  allSuburbs.forEach(geo => {
    suburbMap.set(geo.properties.name, geo);
  });

  const evanDataWithGeo = evanData.map(d => {
    const geoFeature = suburbMap.get(d.suburbName); // Make sure d.suburbName is correct
    return {
      value: d.value,
      geoFeature: geoFeature
    };
  }).filter(d => d.geoFeature); // Filter out entries without a matching feature

  g.selectAll("circle")
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

  function zoomed(event) {
    const transform = event.transform;
    g.attr("transform", transform);
  }
}

// **************************** AUS Zoom Map VISUALISAITON 2 ******************************************
function createAUSMapVisualisation(aus) {
  const projection = d3.geoMercator()
  .fitSize([width, height], aus);
  const path = d3.geoPath().projection(projection);
  const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

  const svg = d3.create("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("width", width)
  .attr("height", height)
  .attr("style", "max-width: 100%; height: auto;")
  .on("click", reset);

  const g = svg.append("g");
  const states = g.append("g")
  .attr("fill", "#444")  // Matching fill color
  .attr("cursor", "pointer")
  .selectAll("path")
  .data(aus.features) 
  .join("path")
  .on("click", clicked)
  .attr("d", path);

  states.append("title")
        .text(d => d.properties.STATE_NAME);

  aus.features.forEach(feature => {
    g.append("path")
      .attr("d", path(feature))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round");
  });

  svg.call(zoom);
  document.getElementById("aus_dataviz").appendChild(svg.node());

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

// **************************** U.S. Bubble Map Interactive VISUALISAITON 1 ******************************************
function bubbleMapVisualisationUS(usStates, usCounties, population) {
  const path = d3.geoPath();
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  const svg = d3.select(".us-visualisation-item")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; margin-left: 50px;")
    .call(zoom);

  const g = svg.append("g");
  g.selectAll("path")
    .data(topojson.feature(usStates, usStates.objects.states).features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#444")
    .attr("stroke", "white");

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
    function zoomed(event) {
      g.attr("transform", event.transform);
  }
}

// **************************** U.S. Zoom Map VISUALISAITON 2 ******************************************
function createUSMapVisualisation(us) {
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
  return Promise.all([
    fetch('/US_JSON_Files/states-albers-10m.json').then(response => response.json()),
    fetch('/US_JSON_Files/counties-albers-10m.json').then(response => response.json()),
    fetch('/US_JSON_Files/population.json').then(response => response.json()),
    fetch('/AUS_JSON_Files/suburb-10.json').then(response => response.json()),
    fetch('/AUS_JSON_Files/au-states-geo.json').then(response => response.json()),
    fetch('/AUS_JSON_Files/au-states-topo.json').then(response => response.json()),
    d3.csv('/AUS_JSON_Files/evan_data.csv'),
    d3.csv('/AUS_JSON_Files/evan-tony-data.csv'),
    d3.csv('/AUS_JSON_Files/ruixing-data.csv'),
    d3.csv('/AUS_JSON_Files/aus-gov-postcode-data-sorted-EDITED.csv'),
    d3.csv('/AUS_JSON_Files/census1.csv'),
    d3.csv('/AUS_JSON_Files/census2.csv'),
    d3.csv('/AUS_JSON_Files/census3.csv'),
    d3.csv('/AUS_JSON_Files/census4.csv'),
    d3.csv('/AUS_JSON_Files/census5.csv'),
    d3.csv('/AUS_JSON_Files/census6.csv'),
    d3.csv('/AUS_JSON_Files/census7.csv'),
    d3.csv('/AUS_JSON_Files/census8.csv'),
    d3.csv('/AUS_JSON_Files/census9.csv'),
    d3.csv('/AUS_JSON_Files/census10.csv'),
    d3.csv('/AUS_JSON_Files/census11.csv'),
    d3.csv('/AUS_JSON_Files/census12.csv'),
  ])
  .then(([usStates, usCounties, rawPopulationData, ausTopoSuburbsData, ausGeoStatesData, ausTopoStatesData, rawEvanData, rawTonyData, rawRuixingData, rawCensusData,
  rawCensus1, rawCensus2, rawCensus3, rawCensus4, rawCensus5, rawCensus6, rawCensus7, rawCensus8, rawCensus9, rawCensus10, rawCensus11, rawCensus12]) => {
    const population = rawPopulationData
      .slice(1) // If there's a header
      .map(([p, state, county]) => ({
        state,
        fips: `${state}${county}`,
        population: +p
    }));
    ausTopoSuburbs = ausTopoSuburbsData;
    ausTopoPostCodes = ausTopoSuburbsData;
    ausGeoStates = ausGeoStatesData;
    ausTopoStates = ausTopoStatesData;

    // Processing Evan data from CSV
    evanData = processCSVData(rawEvanData);
    tonyData = processCSVData(rawTonyData);
    ruixingData = processCSVData(rawRuixingData);
    censusData = processCSVData(rawCensusData);
    census1 = processCSVData(rawCensus1);
    census2 = processCSVData(rawCensus2);
    census3 = processCSVData(rawCensus3);
    census4 = processCSVData(rawCensus4);
    census5 = processCSVData(rawCensus5);
    census6 = processCSVData(rawCensus6);
    census7 = processCSVData(rawCensus7);
    census8 = processCSVData(rawCensus8);
    census9 = processCSVData(rawCensus9);
    census10 = processCSVData(rawCensus10);
    census11 = processCSVData(rawCensus11);
    census12 = processCSVData(rawCensus12);

    currentSelectedData = evanData; // Default or based on the selected dataset

    if (document.querySelector('.aus-visualisation-item')) {
      mapVisualisationAUS(ausTopoStates, ausTopoSuburbs, evanData);
    }
    if (document.querySelector('.aus-visualisation-item2')) {
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

function processCSVData(rawData) {
  return rawData.map(d => {
    return {
        suburbName: d.suburbName.trim(),
        value: +d.value
    };
  });
}