
fetch('states-albers-10m.json')
  .then(response => response.json())
  .then(us => {  // 'us' now contains the JSON data
    // D3 code that uses the 'us' JSON data
    const width = 1200;
    const height = 600;

    // Define zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; margin-left: 50px;") // Adjust the margin if needed
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
    
    // ... rest of your D3 code that uses the 'us' data
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
      d3.select(this).transition().style("fill", "red");
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
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
});

 



// (function() {
//   // GRAPHING WORLD MAP:
//   const width = 1200;
//   const height = 600;

//   const svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

//   const projection = d3.geoMercator().scale(140).translate([width/2, height/1.4]);
//   const path = d3.geoPath(projection);

//   const g = svg.append('g');

//   d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
//     .then(data => {

//       const countries = topojson.feature(data, data.objects.countries);
//       g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'country').attr('d', path);
//     });
// })();



// INITIAL GRAPHING
// (function() {
//   const DUMMY_DATA = [
//     { id: 'd1', value: 10, region: 'USA'},
//     { id: 'd2', value: 11, region: 'China'},
//     { id: 'd3', value: 12, region: 'New Zealand'},
//     { id: 'd4', value: 6, region: 'Australia'},
//   ];

//   const xScale = d3
//   .scaleBand()
//   .domain(DUMMY_DATA.map((dataPoint) => dataPoint.region))
//   .rangeRound([0, 250])
//   .padding(0.1);
//   const yScale = d3.scaleLinear().domain([0, 15]).range([200, 0]);

//   const container = d3.select('svg.visualisation-item').classed('container', true);
//     // .style('border', '1px solid red');

//   const bars = container
//     .selectAll('.bar')
//     .data(DUMMY_DATA)
//     .enter()
//     .append('rect')
//     .classed('bar', true)
//     .attr('width', xScale.bandwidth())
//     .attr('height', (data) => 200 - yScale(data.value))
//     .attr('x', data => xScale(data.region))
//     .attr('y', data => yScale(data.value));
//   // d3.select('.visualisation-item')
//   // .selectAll('p')
//   // .data(jksdahgdsabgcjhvgsdchads)
//   // .enter()
//   // .append('p')
//   // .text(dta => dta.region);
// })();