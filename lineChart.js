
export default function Chart(selection,country){
	d3.select('.line').html('')
	d3.select('.bar').html('')
	const marginLine = ({top: 40, right: 250, bottom: 40, left: 40})
	const widthLine=850-marginLine.left-marginLine.right,
	heightLine=350-marginLine.top-marginLine.bottom
	
	let svgLine=d3.select('.line').append('svg')
		.attr('width',widthLine+marginLine.left+marginLine.right)
		.attr('height',heightLine+marginLine.top+marginLine.bottom)
		.attr("class", "graph-svg-component")
		.append('g')
		.attr('transform','translate('+marginLine.left+','+marginLine.top+')')

	function line(selection,country){

	
		let xScale=d3.scaleTime()
			.range([0,widthLine])

		let yScale=d3.scaleLinear()
			.range([heightLine,0])

		let yScale2=d3.scaleLinear()
			.range([heightLine,0])
		
		let xAxis=d3.axisBottom()
			.scale(xScale)
			.ticks(5)
		
		let yAxis=d3.axisLeft()
			.scale(yScale)
			.ticks(10)

		let yAxis2=d3.axisRight()
			.scale(yScale2)
			.ticks(10)

		svgLine.append('g')
			.attr('class','x-axis')
		svgLine.append('g')
			.attr('class','y-axis')
		svgLine.append('g')
			.attr('class','y-axis2')
		
		svgLine.append('text')
			.attr('class','x-title')
			.attr('x',widthLine/2-13)
			.attr('y',heightLine+35)
			.text('Year')
			
		svgLine.append('text')
			.attr('class','y-title')
			.attr('x',-10)
			.attr('y',-5)


		svgLine.append('text')
			.attr('class','y-title2')
			.attr('x',widthLine-80)
			.attr('y',-5)
			.text('Happiness Score')
			
		svgLine.append("text")
			.attr("x", widthLine / 2 )
			.attr("y", -30)
			.style("text-anchor", "middle")
			.style("font-size","20px")
			.style("font-weight","bold");


		d3.csv('finalDataset.csv',d3.autoType).then(data=> {
			data=data.filter(d=>d['Country']==country)[0]
			let happinessKeys=['2015Happiness Score','2016Happiness Score','2017Happiness Score','2018Happiness Score','2019Happiness Score']
			let keys=[]
			let years=[]
			for (const key in data){
				if (key.includes(selection)){
					years.push(key.substring(0,4))
					keys.push(key)
				}
			}		  

			let filteredData={}

			for (let i=0;i<keys.length;i++){
				filteredData[years[i]]=parseFloat(data[keys[i]])
			}
			let happinessData={}
			for (let i=0;i<happinessKeys.length;i++){
				happinessData[happinessKeys[i].substring(0,4)]=parseFloat(data[happinessKeys[i]])
			}

			filteredData=Object.entries(filteredData).map(([key, value]) => ({key,value}))
			happinessData=Object.entries(happinessData).map(([key, value]) => ({key,value}))
			

			filteredData.map(x=>x.key=new Date(parseInt(x.key),0,1))

			happinessData.map(x=>x.key=new Date(parseInt(x.key),0,1))


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

				var lines=svgLine.selectAll('.lineChart')
					.data([filteredData])

				
				lines.enter()
					.append('path')
					.attr('class','lineChart')
					.merge(lines)
					.transition()
					.duration(700)
					.attr("d", line)
					.attr("fill", "none")
					.attr("stroke", "#81BEF7")
					.attr("stroke-width", 2.5)

				lines.exit()
					.remove()

				var line1=svgLine.selectAll('.lineChart1')
					.data([happinessData])

				
				line1.enter()
					.append('path')
					.attr('class','lineChart1')
					.transition()
					.duration(700)
					.attr("d", happinessLine)
					.attr("fill", "none")
					.attr("stroke", "#F78181")
					.attr("stroke-width", 2.5)
					
				var circles=svgLine.selectAll('.filteredCircles')
					.data(filteredData)
					
				circles.enter()
					.append('circle')
					.attr('class','filteredCircles')
					.merge(circles)
					.transition()
					.duration(700)
					.attr('cx',function(d){
						return xScale(d.key)
					})
					.attr('cy',function(d){
						return yScale(d.value)
					})
					.attr('r',5)
					.attr('fill','#81BEF7')
					

				var happinessCircles=svgLine.selectAll('.happinessCircles')
					.data(happinessData)
					
				happinessCircles.enter()
					.append('circle')
					.attr('class','happinessCircles')
					.merge(happinessCircles)
					.attr('cx',function(d){
						console.log(d)
						return xScale(d.key)
					})
					.attr('cy',function(d){
						return yScale2(d.value)
					})
					.attr('r',5)
					.attr('fill','#F78181')
					.on('click', function(event,d){
						const pos=d3.pointer(event,window)
						const yr=xScale.invert(pos[0]).getYear()-100+2000-3
						bar(yr.toString())
					})


				svgLine.select('.x-axis')
					.call(xAxis)
					.attr('transform',`translate(0,${heightLine})`)
				
				svgLine.select('.y-axis')
					.call(yAxis)
					.attr('transform',`translate(0,0)`)
				svgLine.select('.y-axis2')
				.call(yAxis2)
				.attr('transform',`translate(${widthLine},0)`)

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

				svgLine.select('.y-title')
						.text(title)
						.attr('transform',`translate(-10,0)`)

				svgLine.append('circle')
					.attr('cx',620)
					.attr('cy',0)
					.attr('r',6)
					.attr('fill','#81BEF7')

				let factorText=svgLine.selectAll('.factorText')
					.data([title])

				factorText.enter()
					.append('text')
					.attr('class','factorText')
					.merge(factorText)
					.attr('x',630)
					.attr('y',3)
					.text(function(d){return d})

				factorText.exit().remove()
				
				svgLine.append('circle')
					.attr('cx',620)
					.attr('cy',15)
					.attr('r',6)
					.attr('fill','#F78181')

				svgLine.append('text')
					.attr('x',630)
					.attr('y',18)
					.text('Happiness Score')

		})
	}
	const marginBar = ({top: 100, right: 20, bottom: 40, left: 20})
	const widthBar=1000-marginBar.left-marginBar.right,
		heightBar=500-marginBar.top-marginBar.bottom

	const svgBar=d3.select('.bar').append('svg')
		.attr('width',widthBar+marginBar.left+marginBar.right)
		.attr('height',heightBar+marginBar.top+marginBar.bottom)
		.append('g')
		.attr('transform','translate('+marginBar.left+','+marginBar.top+')')
		
	function bar(time){

		d3.select('hr').classed('hidden',false)

		let xScale=d3.scaleBand()
			.range([50,widthBar])
			.paddingInner(0.1)

		let yScale=d3.scaleLinear()
			.range([heightBar,5])

		let ScoreScale=d3.scaleLinear()
			.range([5,heightBar])

		let colorScale = d3.scaleLinear(d3.schemeBlues[6])

		svgBar.append('g')
			.attr('class','x-axis')
			.attr("transform", `translate(0, ${heightBar})`)
			

		svgBar.append('g')
			.attr('class','y-axis')
			.attr('transform',`translate(50,0)`)

		svgBar.append('text')
			.attr('class','y-title')
			.attr('x',0)
			.attr('y',-5)
			.text('Happiness Score')

		d3.csv('finalDataset.csv', d3.atuoType).then(data=>{
			let happinessKeys=['2015Happiness Score','2016Happiness Score','2017Happiness Score','2018Happiness Score','2019Happiness Score']
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
			filteredData=filteredData.slice(0,100)

			xScale.domain(filteredData.map(d=>d.Country))
		
			yScale.domain([d3.min(filteredData,d=>d.Score),d3.max(filteredData,d=>d.Score)])

			ScoreScale.domain([d3.min(filteredData,d=>d.Score),d3.max(filteredData,d=>d.Score)])

			colorScale.domain([d3.min(filteredData,d=>d.Score)*30,d3.max(filteredData,d=>d.Score)*60])

			const bars=svgBar.selectAll('.barChart')
				.data(filteredData,d=>d)

			bars.enter()
				.append("rect")
				.attr('x',function(d,i){
					return xScale(d.Country)+3
				})
				.attr('y',function(d,i){
					return heightBar-ScoreScale(d.Score)
				})
				.attr('opacity',0.6)
				.merge(bars)
				.transition()
				.duration(1000)
				.attr('x',function(d,i){
					return xScale(d.Country)+3
				})
				.attr('y',function(d,i){
					return heightBar-ScoreScale(d.Score)
				})
				.attr('width',xScale.bandwidth())
				.attr('height',function(d){
					return ScoreScale(d.Score)
				})
				.attr('fill',function(d){
					return colorScale(d.Score*100)
				})
				.attr('opacity',1)
				// .on('mouseover',(event,d)=>{
				// 	const pos=d3.pointer(event, window)
				// 	d3.select("#tooltipBar")
				// 		.style("left", pos[0] + "px")
				// 		.style("top", pos[1] + "px")
				// 		.html(
				// 			"Country: "+d.Country+
				// 			"<br>Happiness Score: "+d3.format(".1f")(d.Score));
					
				// 	d3.select('#tooltipBar').classed('hidden',false)
				// })
				// .on('mouseout',(event,d)=>{
				// 	d3.select('#tooltipBar').classed('hidden',true)
				// })
			
			bars.exit()
				.transition()
				.remove()


			const xAxis=d3.axisBottom()
				.scale(xScale)
			
			const yAxis=d3.axisLeft()
				.scale(yScale)

			svgBar.select('.x-axis')
				.attr("transform", `translate(0,${heightBar})`)
				.transition()
				.duration(1000)
				.call(xAxis)
			
			svgBar.select('.y-axis')
				.call(yAxis)
			
			svgBar.select('.x-axis')
				.selectAll("text")
				.attr('transform',`translate(15,5) rotate(90)`)
				.style("text-anchor", "start");
			
			yTitle=svgBar.selectAll('.title')
				.data([time])

			yTitle.enter()
				.append('text')
				.attr('class','title')
				.merge(yTitle)
				.transition()
				.duration(1000)
				.attr('x',widthBar/3)
				.attr('y',-30)
				.attr('font-size',20)
				.attr('font-family','"Andale Mono"')
				.text(function(d){return 'Top 100 Happiness Score Country in '+d})

			yTitle.exit().remove()
		})


	}

	line(selection,country)

	const dropdownElement=document.querySelector("#line-type");
	dropdownElement.addEventListener('change',(event)=>{
	//d3.select('.line').html('')
	if(event.target.value==='LE'){
		selection='LE'
		line(selection,country)
	} else if(event.target.value==='GDP'){
		selection='GDP'
    console.log(selection)
		line(selection,country)
	} else if(event.target.value==='HF'){
		selection='HF'
    console.log(selection)
		line(selection,country)
	} else if(event.target.value==='HS'){
		selection='HS'
    console.log(selection)
		line(selection,country)
	}
})

	return{

	}

}
