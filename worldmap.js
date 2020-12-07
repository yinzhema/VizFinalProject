import line from './lineChart.js'
import spiderChart from './spiderChart.js'

let country='United States'
let selection='LE'

line(selection,country)
spiderChart(country)

Promise.all([ // load multiple files
    d3.csv('happinesss.csv', d3.autoType),
    d3.json('world-110m.json')
]).then(data=>{ // or use destructuring :([airports, wordmap])=>{ ... 
    let happiness = data[0]; // data1.csv
    let worldmap = data[1]; // data2.json

    console.log("happiness", happiness)

let margin = { top: 40, right: 100, bottom: 40, left: 100 },
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;



let svg = d3
.select(".chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const features = topojson.feature(worldmap, worldmap.objects.countries).features;
    console.log('features', features);
    
const projection = d3.geoMercator()
.fitExtent([[0,0], [width,height]], topojson.feature(worldmap, worldmap.objects.countries));

var max = (d3.max(happiness, function (d) {return d['happinessScore']}));
var min = (d3.min(happiness, function (d) {return d['happinessScore']}));

d3.select('#happiest')
.style('display','block')
.style('background-color', 'rgb(129, 190, 247)')
  .style('opacity',0.7)
.style('color','white')
.style('border-radius', '50%')
.style('width','200px')
.style('height','200px')
.style('text-align','center')
.style('font-weight','3')
.style('padding','10px')
.style('font-size','14pt')
.attr('class', 'grow')
.html("<br>"+"<br>"+"<u>"+"Happiest Country:"+"</u>"+"<br>"+"<b>"+" Finland" +"</b>"+ "<br>"+"<u>"+"Happiness Score:"+"</u>"+ " " + max)

d3.select('#saddest')
.style('display','block')
.style('background-color','lightcoral')
.style('opacity',0.7)
.style('color','white')
.style('border-radius', '50%')
.style('width','160px')
.style('height','160px')
.style('text-align','center')
.style('font-weight','3')
.style('padding','10px')
.style('font-size','14pt')
.attr('class', 'grow')
.html("<br>"+"<u>"+"Least Happy Country:"+"</u>"+"<br>"+"<b>"+"South Sudan" +"</b>" + "<br>"+"<u>"+"Happiness Score:"+"</u>"+ " " + min) 
  
  
// The Tooltip
const Tooltip = d3.select('.chart')
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
    .range(d3.schemeBlues[5]);




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
    const pos = d3.pointer(event,window);
    Tooltip.style('visibility', 'visible')
            .style("top",pos[1]-20+'px')
            .style("left",pos[0]+20+'px');
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
        .style('top', (event.y +10) + '-px');
    } else {
      // There is no agg for this country, display name and a 0 count
      Tooltip
        .html(features.properties.name + '<br>' + 'Happiness Score: No Data')
        .style('left', (event.x + 10) + 'px')
        .style('top', (event.y + 10) + '-1px');
    }
  })
  .on('click',(event,features)=>{
    const country = happiness.find(s=>s.Country==features.properties.name);
    if (country){
      document.getElementById('LE').selected=true
      spiderChart(country.Country);
      line(selection,country.Country);
      console.log(country.Country)
      document.getElementById('instructions').innerText="We are looking at the break down happiness factors for "+country.Country
      document.getElementById('lineInstructions').innerText="We are exploring the correlation betweena Happiness Score and these following factors: GDP per Capita, Life Expectancy, Freedom, Life Satisfaction. We are currently exploring these correlations in "+country.Country}
  })




svg.append("path")
.datum(topojson.mesh(worldmap, worldmap.objects.countries))
.attr("d", path)
.attr('fill', 'none')
.attr('stroke', 'white')
.attr("class", "subunit-boundary")

//legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
  
g.append("text")
    .attr("class", "caption")
    .attr("x", 555)
    .attr("y", 350)
    .text("Happiness Score");  

g.append("rect")
    .attr("x", width -10)
    .attr("width", 16)
    .attr("height", 12)
    .attr('y',height-160)
    .attr('fill','darkgray')
  
g.append("text")
    .attr("x", 608)
    .attr("y", 371)
    .text("No Data"); 
  

var labels = ['0','1-2', '3-4', '5-6', '7-8','9-10'];
var legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(" + "-50," + i * 20 + ")"; });
  
  
    legend.append("rect")
            .attr("x", width + 60)
            .attr("width", 16)
            .attr("height", 12)
            .attr('y',height-120)
            .style("fill", colorScale);

    legend.append("text")
            .data(labels)
            .attr("x", width + 80)
            .attr("dy", ".65em")
            .attr('y',height-120)
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


