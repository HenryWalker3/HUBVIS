import * as d3 from "d3";

fetch('counties-albers-10m.json')
  .then(response => response.json())
  .then(data => {
    // Use your JSON data here
  })
  .catch(error => console.error('Error:', error));

fetch('package-lock.json')
  .then(response => response.json())
  .then(data => {
    // Use your JSON data here
  })
  .catch(error => console.error('Error:', error));

fetch('package.json')
  .then(response => response.json())
  .then(data => {
    // Use your JSON data here
  })
  .catch(error => console.error('Error:', error));

fetch('package-lock.json')
  .then(response => response.json())
  .then(data => {
    // Use your JSON data here
  })
  .catch(error => console.error('Error:', error));





// *** ADJUST ALL VALUES TO AUS ***
d3.json("counties-albers-10m.json").then(function(data) {
    // "data" contains your JSON data
    // You can now use this data as required in your D3 visualizations
    console.log(data);
}).catch(function(error) {
    console.error('Error loading the JSON file:', error);
});

nation = topojson.feature(us, us.objects.nation)
statemap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]))
countymap = new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]))
statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)
spike = (length, width = 7) => `M${-width / 2},0L0,${-length}L${width / 2},0`

Plot.plot({
    width: 975,
    projection: "identity",
    length: {range: [0, 200]},
    marks: [
      Plot.geo(nation, { fill: "#eee" }),
      Plot.geo(statemesh, { stroke: "white" }),
      Plot.spike(population, Plot.centroid({length: "population", geometry: ({fips}) => countymap.get(fips)}))
    ]
})



