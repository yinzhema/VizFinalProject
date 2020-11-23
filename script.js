let selection='LE'
let country='United States'


function lineChart(selection,country){

	const margin = ({top: 60, right: 200, bottom: 40, left: 40})
	const width=800-margin.left-margin.right,
	height=350-margin.top-margin.bottom
	
	let svg=d3.select('.Chart').append('svg')
		.attr('width',width+margin.left+margin.right)
		.attr('height',height+margin.top+margin.bottom)
		.attr("class", "graph-svg-component")
		.append('g')
		.attr('transform','translate('+margin.left+','+margin.top+')')
	
	let xScale=d3.scaleTime()
		.range([10,width+10])

	let yScale=d3.scaleLinear()
		.range([height,0])

	let yScale2=d3.scaleLinear()
		.range([height,0])
	
	let xAxis=d3.axisBottom()
		.scale(xScale)
		.ticks(5)
	
	let yAxis=d3.axisLeft()
		.scale(yScale)

	let yAxis2=d3.axisRight()
		.scale(yScale2)

	svg.append('g')
		.attr('class','x-axis')
	svg.append('g')
		.attr('class','y-axis')
	svg.append('g')
		.attr('class','y-axis2')
	
	svg.append('text')
		.attr('class','x-title')
		.attr('x',width-20)
		.attr('y',height+30)
		.text('Year')
		
	svg.append('text')
		.attr('class','y-title')
		.attr('x',-10)
		.attr('y',-5)
		//.text('CO2 Emission (metric tons per capita)')
		//style("font-size","10px")

	svg.append('text')
		.attr('class','y-title2')
		.attr('x',width-80)
		.attr('y',-5)
		.text('Happiness Score')
		
	svg.append("text")
		.attr("x", width / 2 )
		.attr("y", -30)
		.style("text-anchor", "middle")
		//.text("CO2 Emissions in " +country+" (1960 - 2015)")
		.style("font-size","20px")
		.style("font-weight","bold");


	d3.csv('finalDataset.csv', function(data) {
		  data=data.filter(d=>d['Country']==country)[0]
		  happinessKeys=['2015Happiness Score','2016Happiness Score','2017Happiness Score','2018Happiness Score','2019Happiness Score']
		  let keys=[]
		  let years=[]
		  for (const key in data){
			  if (key.includes(selection)){
				 years.push(key.substring(0,4))
				 keys.push(key)
			  }
		  }		  

		  let filteredData={}

		  for (i=0;i<keys.length;i++){
			  filteredData[years[i]]=parseFloat(data[keys[i]])
		  }
		  let happinessData={}
		  for (i=0;i<happinessKeys.length;i++){
			happinessData[happinessKeys[i].substring(0,4)]=parseFloat(data[happinessKeys[i]])
		}

		  filteredData=Object.entries(filteredData).map(([key, value]) => ({key,value}))
		  happinessData=Object.entries(happinessData).map(([key, value]) => ({key,value}))
		
		  filteredData.map(x=>x.key=new Date(x.key,1,1))
		  happinessData.map(x=>x.key=new Date(x.key,1,1))

		  xScale.domain(d3.extent(filteredData,d=>d.key))
		  yScale.domain([d3.min(filteredData,d=>d.value),d3.max(filteredData,d=>d.value)])
		  yScale2.domain([d3.min(happinessData,d=>d.value),d3.max(happinessData,d=>d.value)])
  
		  var line=d3.line()
		  .x(function(d){
			  return xScale(d.key)
		  })
		  .y(function(d){
			  return yScale(d.value)
		  })
		  
		  var happinessLine=d3.line()
		  .x(function(d){
			  return xScale(d.key)
		  })
		  .y(function(d){
			  return yScale2(d.value)
		  })

			var lines=svg.selectAll('.lineChart')
				.data([filteredData])

			
			lines.enter()
				.append('path')
				.attr('class','lineChart')
				.merge(lines)
				.attr("d", line)
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-width", 1.5)

			lines.exit()
				.remove()

			
			var line1=svg.selectAll('.lineChart1')
				.data([happinessData])

			
			line1.enter()
				.append('path')
				.attr('class','lineChart1')
				.attr("d", happinessLine)
				.attr("fill", "none")
				.attr("stroke", "red")
				.attr("stroke-width", 1.5)
				
			var circles=svg.selectAll('.filteredCircles')
				.data(filteredData)
				
			circles.enter()
				.append('circle')
				.attr('class','filteredCircles')
				.merge(circles)
				.attr('cx',function(d){
					return xScale(d.key)
				})
				.attr('cy',function(d){
					return yScale(d.value)
				})
				.attr('r',3)
				.attr('fill','steelblue')

			var happinessCircles=svg.selectAll('.happinessCircles')
				.data(happinessData)
				
			happinessCircles.enter()
				.append('circle')
				.attr('class','happinessCircles')
				.merge(circles)
				.attr('cx',function(d){
					return xScale(d.key)
				})
				.attr('cy',function(d){
					return yScale2(d.value)
				})
				.attr('r',3)
				.attr('fill','red')
				.on('click',function(event,d){
					const pos=d3.mouse(this)
					const yr=xScale.invert(pos[0]).getYear()-100+2000
					barChart(yr.toString())
				})


			svg.select('.x-axis')
				.call(xAxis)
				.attr('transform',`translate(0,${height})`)
			
			svg.select('.y-axis')
				.call(yAxis)
				.attr('transform',`translate(10,0)`)
		  svg.select('.y-axis2')
			  .call(yAxis2)
			  .attr('transform',`translate(${width+10},0)`)

			let title;

			if(selection=='LE'){
				title='Life Expectancy'
			} else if (selection=='GDP'){
				title='GDP per Capita'
			} else if (selection=='HF'){
				title='Human Freedom Index'
			} else{
				title='Life Satisfaction Score'
			}  

			svg.select('.y-title')
					.text(title)

			svg.append('circle')
				.attr('cx',630)
				.attr('cy',0)
				.attr('r',6)
				.attr('fill','steelblue')

			svg.append('text')
				.attr('x',640)
				.attr('y',3)
				.text(title)

			svg.append('circle')
				.attr('cx',630)
				.attr('cy',15)
				.attr('r',6)
				.attr('fill','red')

			svg.append('text')
				.attr('x',640)
				.attr('y',18)
				.text('Happiness Score')

	  })
}

lineChart(selection,country)


function barChart(time){
	const margin = ({top: 40, right: 20, bottom: 40, left: 20})
	const width=750-margin.left-margin.right,
		  height=500-margin.top-margin.bottom
		  
	d3.select('.barChart').html("")

	const svg=d3.select('.barChart').append('svg')
			.attr('width',width+margin.left+margin.right)
			.attr('height',height+margin.top+margin.bottom)
			.append('g')
			.attr('transform','translate('+margin.left+','+margin.top+')')

	let xScale=d3.scaleBand()
			.range([50,width])
			.paddingInner(0.1)

	let yScale=d3.scaleLinear()
			.range([height,5])

	let ScoreScale=d3.scaleLinear()
			.range([5,height])

	svg.append('g')
			.attr('class','x-axis')
			.attr("transform", `translate(0, ${height})`)
			

	svg.append('g')
			.attr('class','y-axis')
			.attr('transform',`translate(50,0)`)

	svg.append('text')
			.attr('class','y-title')
			.attr('x',0)
			.attr('y',-5)
			.text('Happiness Score')

	d3.csv('finalDataset.csv', function(data) {
		happinessKeys=['2015Happiness Score','2016Happiness Score','2017Happiness Score','2018Happiness Score','2019Happiness Score']
		let year;
		happinessKeys.forEach(function(k){
			if (k.includes(time)){
				year=k
			}
		})
		let filteredData=data.map(function(item){
			return {'Score':parseFloat(item[year]),'Country':item['Country']}
		})
		filteredData.sort((a,b)=>a.Score-b.Score).reverse()
		filteredData=filteredData.slice(0,10)

		xScale.domain(filteredData.map(d=>d.Country))
	
		yScale.domain([d3.min(filteredData,d=>d.Score),d3.max(filteredData,d=>d.Score)])

		ScoreScale.domain([d3.min(filteredData,d=>d.Score),d3.max(filteredData,d=>d.Score)])

		const bars=svg.selectAll('.bar')
			.data(filteredData,d=>d)

		bars.enter()
			.append("rect")
			.attr('x',function(d,i){
				return 0
			})
			.attr('y',function(d,i){
				return height
			})
			.merge(bars)
			.transition()
			.attr('x',function(d,i){
				return xScale(d.Country)+3
			})
			.attr('y',function(d,i){
				return height-ScoreScale(d.Score)
			})
			.attr('width',xScale.bandwidth()-3)
			.attr('height',function(d){
				return ScoreScale(d.Score)
			})
			.attr('fill','skyblue')
			.attr('opacity',1)
		
		bars.exit()
			.remove()

		const xAxis=d3.axisBottom()
			.scale(xScale)
		
		const yAxis=d3.axisLeft()
			.scale(yScale)

		svg.select('.x-axis')
			.call(xAxis)
		
		svg.select('.y-axis')
			.call(yAxis)
		
		svg.select('.x-axis')
			.selectAll("text")
			.attr("transform", "rotate(-15)")

		svg.select('.y-title')
			.text('Top 10 Happiness Score Country in '+time)
	})
}


const dropdownElement=document.querySelector("#line-type");
dropdownElement.addEventListener('change',(event)=>{
	d3.select('.Chart').html('')
	if(event.target.value==='LE'){
		selection='LE'
		lineChart(selection,country)
	} else if(event.target.value==='GDP'){
		selection='GDP'
		lineChart(selection,country)
	} else if(event.target.value==='HF'){
		selection='HF'
		lineChart(selection,country)
	} else if(event.target.value==='HS'){
		selection='HS'
		lineChart(selection,country)
	}
})
  
