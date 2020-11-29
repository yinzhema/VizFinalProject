Promise.all([ // load multiple files
    d3.csv('happinesssss.csv', d3.autoType),
    d3.json('world-110m.json')
]).then(data=>{ // or use destructuring :([airports, wordmap])=>{ ... 
    let happiness = data[0]; // data1.csv
    let worldmap = data[1]; // data2.json

let margin = { top: 40, right: 20, bottom: 40, left: 100 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;



let svg = d3
.select(".chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const features = topojson.feature(worldmap, worldmap.objects.countries).features;
    
const projection = d3.geoMercator()
.fitExtent([[0,0], [width,height]], topojson.feature(worldmap, worldmap.objects.countries));

// The Tooltip
const Tooltip = d3.select('body')
.append('div')
.attr('class', 'tooltip')
.style('visibility', 'hidden')
.style('background-color', 'white')
.style('border', 'solid')
.style('border-width', '2px')
.style('border-radius', '5px')
.style('padding', '5px')
.style('position', 'absolute')
.on('mouseover', (event) => {
  // A bug where if the user's cursor gets on top of the Tooltip, it flashes infinitely until the user's cursor moves
  // Very distracting and this gets rid of it completely. Besides, the cursor should never be over the Tooltip anyway
  Tooltip.style('visibility', 'hidden');
});

const path = d3.geoPath()
.projection(projection);

const colorScale = d3.scaleThreshold()
    .domain([1, 3, 5, 7, 9, 11])
    //.domain(['N/A', 1-2, 3-4, 5-6, 7-8,9-10])
    .range(d3.schemeBlues[6]);




svg.selectAll("path")
.data(features)
.join("path")
.attr('class', 'country')
.attr("d", path)
.attr("fill", d=>{
    const country = happiness.find(s=>s.Country==d.properties.name);
    if (!country) return "darkgray";
    return colorScale(country.happinessScore)
})
//.attr("fill", function (d){
    // Pull data for this country
  //  d.happinessScore = data.get(d.id) || 0;
    // Set the color
   // return colorScale(d.happinessScore);
// Events are given the event object and the feature object (AKA datum AKA d as it is usually shown in documentation)
.on('mouseover', (event, features) => {
    // This adds the styling to show the user they are hovering over the country
    d3.select('#country' + features.properties.name)
      .transition()
      .duration(200)
      .attr('opacity', '0.5')
      .attr('stroke-width', '1px');
    // Show the Tooltip
    Tooltip.style('visibility', 'visible');
  })
  .on('mouseleave', (event, features) => {
    // This clears out the remaining styles on all other countries not currently being hovered
    d3.selectAll('.country')
      .transition()
      .duration(200)
      .attr('opacity', '1')
      .attr('stroke-width', '.5px');
    // Hide the tooltip
    Tooltip.style('visibility', 'hidden');
  })
  .on('mousemove', (event, features) => {
    // This adds the tooltip where the user's cursor currently is
    const country = happiness.find(s=>s.Country==features.properties.name);
    if (country) {
      // We have an agg for this country, display name and their count
      Tooltip
        .html(features.properties.name + '<br>' + 'Happiness Score: ' + country.happinessScore)
        .style('left', (event.x + 10) + 'px')
        .style('top', (event.y + 10) + 'px');
    } else {
      // There is no agg for this country, display name and a 0 count
      Tooltip
        .html(features.properties.name + '<br>' + 'Happiness Score: No Data')
        .style('left', (event.x + 10) + 'px')
        .style('top', (event.y + 10) + 'px');
    }
  });




svg.append("path")
.datum(topojson.mesh(worldmap, worldmap.objects.countries))
.attr("d", path)
.attr('fill', 'none')
.attr('stroke', 'white')
.attr("class", "subunit-boundary")

//legend
var labels = ['N/A', '1-2', '3-4', '5-6', '7-8','9-10'];
var legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(" + "-50," + i * 20 + ")"; });
    
    legend.append("rect")
            .attr("x", width + 10)
            .attr("width", 12)
            .attr("height", 12)
            .attr('y',height-150)
            .style("fill", colorScale);

    legend.append("text")
            .data(labels)
            .attr("x", width + 26)
            .attr("dy", ".65em")
            .attr('y',height-150)
            .text(function(d) {
                return d
            });

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', function(event) {
    svg.selectAll('path')
        .attr('transform', event.transform);
    svg.selectAll("circle")
        .attr('transform', event.transform);
      });
      
      svg.call(zoom);

});








