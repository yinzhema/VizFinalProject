var lifeValue = 0,
corruptValue = 0,
gdpValue = 0,
freedomValue = 0,
socialValue = 0,
genValue = 0;

d3.csv('2019.csv',d=>{
  return{
    ...d,
    Score: +d.Score,
    
    
  }
}).then(data=>{
  
})

d3.csv('2019.csv',d3.autoType).then(data=> {
  data=data.filter(d=>d.Country=='Finland')
  data=Object.entries(data[0]).map(([key, value]) => ({key,value}))
		data.map(x=>x.key=new Date(x.key,1,1))
		const len=data.length
		data=data.slice(0,len-2)
    data.forEach(function(d){
      d.value=+d.value;
    })
  lifeValue = data['life expectancy'];
  corruptValue = data['corruption'];
  gdpValue = data['GDP'];
  freedomValue = data['freedom'];
  socialValue = data['Social support'];
  genValue = data['Generosity'];
  console.log('Radar Chart:'+data);
  
  
  
});

var margin = { top: 100, right: 100, bottom: 100, left: 100 },
  width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(
    width,
    window.innerHeight - margin.top - margin.bottom - 20
  );


var data = [
  [
    //iPhone
    { axis: "Life Expectancy", value: 0.98 },
    { axis: "Absence of Corruption", value: 0.28 },
    { axis: "Gross Domestic Product", value: 0.99 },
    { axis: "Freedom", value: 0.27 },
    { axis: "Social Support", value: 0.57 },
    { axis: "Generosity", value: 0.4 }
  ]
];



var color = d3.scaleThreshold()
    .range(d3.schemeGreens[6]);

var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};

RadarChart(".radarChart", data, radarChartOptions);
