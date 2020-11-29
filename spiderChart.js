    

export default function spiderChart(country){

    d3.select('.spider').html('')

    const margin = ({top: 30, right: 30, bottom: 30, left: 30})
	const width=800-margin.left-margin.right,
    height=800-margin.top-margin.bottom

    let svg=d3.select('.spider').append('svg')
        .attr('width',width+margin.left+margin.right)
        .attr('height',height+margin.top+margin.bottom)
        .attr("class", "graph-svg-component")
        .append('g')
        .attr('transform','translate('+margin.left+','+margin.top+')')

    d3.csv('2019.csv',d3.autoType).then(data=>{
        let factors=['Freedom','GDP','Generosity','Social support','corruption','life expectancy']
        data=data.filter(d=>d['Country']==country)[0]
        let filteredData={}
        for(let i=0;i<factors.length;i++){
            filteredData[factors[i]]=data[factors[i]]
        }
        let sumFunc = obj => Object.values(obj).reduce((a, b) => a + b);
        const sum=sumFunc(filteredData)
        for (const key in filteredData){
            filteredData[key]=filteredData[key]/sum
        }
        const max=Math.max(...Object.values(filteredData))
        let radialScale = d3.scaleLinear()
            .domain([0,max])
            .range([0,250]);

        let textScale = d3.scaleLinear()
            .domain([0,max])
            .range([0,150]);

        const increment=max/4
        let ticks = []
        for(i=0;i<max;i=i+increment){
            ticks.push(i)
        }
        ticks.push(max)

        ticks.forEach(t =>
            svg.append("circle")
            .attr("cx", 300)
            .attr("cy", 300)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("r", radialScale(t))
        );
        ticks.forEach(t =>
            svg.append("text")
            .attr("x", 300+textScale(t/2))
            .attr("y", 300 - radialScale(t)-1)
            .text(parseInt(t*100).toString()+'%')
        );

        function angleToCoordinate(angle, value){
            let x = Math.cos(angle) * radialScale(value);
            let y = Math.sin(angle) * radialScale(value);
            return {"x": 300 + x, "y": 300 - y};
        }

        for (var i = 0; i < factors.length; i++) {
            let ft_name = factors[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / factors.length);
            let line_coordinate = angleToCoordinate(angle, max);
            let label_coordinate = angleToCoordinate(angle, max*1.05);
        
            //draw axis line
            svg.append("line")
            .attr("x1", 300)
            .attr("y1", 300)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke","black");
        
            //draw axis label
            svg.append("text")
            .attr("x", function(d){
                if (label_coordinate.x<=100){
                    return label_coordinate.x-65
                }
                return label_coordinate.x
            })
            .attr("y", label_coordinate.y)
            .text(ft_name);
        }
            let line = d3.line()
                .x(d => d.x)
                .y(d => d.y);

            function getPathCoordinates(data_point){
                let coordinates = [];
                for (var i = 0; i < factors.length; i++){
                    let ft_name = factors[i];
                    let angle = (Math.PI / 2) + (2 * Math.PI * i / factors.length);
                    coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
                }
                return coordinates;
            }

            let coordinates = getPathCoordinates(filteredData);
            console.log(coordinates)
            svg.append("path")
                .datum(coordinates)
                .attr("d",line)
                .attr("stroke-width", 3)
                .attr("stroke", "#81BEF7")
                .attr("fill", "#81BEF7")
                .attr("stroke-opacity", 1)
                .attr("opacity", 0.5);
    })
    return {

    }
}

