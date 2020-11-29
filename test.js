export default function scatter_chart(dat, area, sorting, GDP_data, population_data) {

    var data = dat;

    console.log(getGDP(data[1].Country_Name));
    for (let i = 0; i < data.length; i++) {
        if (typeof getGDP(data[i].Country_Name) == 'undefined') {
            data[i].GDP = 0;
        } else {
            data[i].GDP = getGDP(data[i].Country_Name);
            data[i].POP = getPopulation(data[i].Country_Name);
        }
    }

    let sort = 0
    data.sort(function (a, b) {
        return a.Value - b.Value;
    });

    var margin = {
        top: 70,
        right: 37,
        bottom: 155,
        left: 80
    };

    var width = 1100 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    let svg = d3.select(area).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var tip = d3.tip()
        .attr('class', 'tooltip')
        .offset([-20, 0])
        .html(function (d) {
            return d.Country_Name + " <br> <b>" + (d.Value/d.POP*100).toFixed(2)+"%" + "</b>";
        })

    svg.call(tip);

    let HIVMin = d3.min(data, d => d.Value / getPopulation(d.Country_Name) * 100);
    let HIVMax = d3.max(data, d => d.Value / getPopulation(d.Country_Name) * 100);
    let HIVScale = d3.scaleLinear()
        .domain([HIVMin, HIVMax])
        .range([1, 50]);

    let fill_color = d3.scaleLinear(d3.schemeGreens[7]).domain([0, 2000]);


    let x = d3.scaleBand()
        .range([0, width])
        .paddingInner(0.1);

    let xAxis = d3.axisBottom()
        .scale(x);

    let y = d3.scaleLinear()
        .range([height, 0]);

    let yAxis = d3.axisLeft()
        .scale(y);

    // Initialize SVG axes groups here

    let xAxisGroup = svg.append("g")
        .attr("class", "x-axis axis");

    let yAxisGroup = svg.append("g")
        .attr("class", "y-axis axis");

    x.domain(data.map(function (d) {
        return d.Country_Name;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.Value / getPopulation(d.Country_Name) * 100;
    })]);


    // Draw Axes
    xAxisGroup = svg.select(".x-axis")
        .attr("transform", "translate(0," + height + ")")
        .transition()
        .duration(1000)
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    yAxisGroup = svg.select(".y-axis")
        .transition()
        .duration(750)
        .call(yAxis);



    var annotations = svg.append("g")
    .attr("font-family", "Playfair Display, serif")
    .attr("font-size", 10)
        .attr("class","annotation-bar")
        .attr("text-anchor", "start")
        .attr("color","grey")
        .attr("font-weight","bold");

    var ylabel = annotations.append("text")
        .attr("x", -50)
        .attr("y", -10)
        .attr("dy", "0.32em")
        .text("HIV Incidents/Population Ratio (%)");
        
    var xlabel = annotations.append("text")
        .attr("x", width-8)
        .attr("y", height-5)
        .attr("dy", "0.32em")
        .text("Country");

    d3.select(sorting).on("click", function () {
        // let selectBox = document.querySelector("#ranking-type");
        // let selectedValue = selectBox.options[selectBox.selectedIndex].value;
        if (sort == 0) {
            sort = 1;
            console.log(sort)
        } else if (sort == 1) {
            sort = 0;
            console.log(sort)
        }
        updateSorting(sort);
    });


    // ** Map Data **
    let element = svg.selectAll("circle")
        .data(data);

    let circle = element
        .enter()
        .append("circle")
        .attr("class", "circle");

    circle
        .merge(circle)
        .attr("opacity", 0.6)
        .attr('fill', (d) => fill_color(d.GDP))
        .style("stroke", "#7777")
        .on('mouseover', function (d) {
            d3.select(this)
                .transition(50)
                .style("opacity", 1)
                .style("transform", "translateY(-" + (HIVScale(d.Value / d.POP) / 5 + 8) +
                    "px)");

            tip.show(d);
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition(250)
                .style("opacity", 0.6)
                .style("transform", "translateY(0px)");;

            tip.hide(d);
        })
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .attr("cx", (d) => x(d.Country_Name))
        .attr("cy", (d) => y(d.Value / d.POP * 100))
        .attr("r", (d) => HIVScale(d.Value / d.POP * 100));

    let label = svg.selectAll("label")
        .data(data);

    label
        .enter()
        .append("label")
        .attr("class", "label");


    label
        .merge(label)
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text(function (d) {
            if (d.Value / getPopulation(d.Country_Name) > 0.1) {
                return d.Country_Name
            }
        })
        .transition()
        .duration(1000)
        .attr("x", (d) => x(d.Country_Name))
        .attr("y", (d) => y(d.Value / getPopulation(d.Country_Name) * 100))
        .attr("fill", "gray");



    // Draw Axes
    xAxisGroup = svg.select(".x-axis")
        .attr("transform", "translate(0," + height + ")")
        .transition()
        .duration(1000)
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    circle.exit()
        .transition()
        .remove();

    label.exit()
        .transition()
        .remove();


    const annotations_new = [{
            //below in makeAnnotations has type set to d3.annotationLabel
            //you can add this type value below to override that default
            note: {
                label: "A different annotation type",
                title: "d3.annotationCalloutCircle",
                wrap: 190
            },
            //settings for the subject, in this case the circle radius
            // subject: {
            //     radius: 50,
            //     opacity: 0
            // },
            x: 800,
            y: 150,
            dy: -100,
            dx: 70
        }].map(function (d) {
            d.color = "#E8336D";
            return d
        })
    
        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations_new)
    
    
        // d3.select(area).select("svg")
        //     .append("g")
        //     .attr("class", "annotation-group")
        //     .call(makeAnnotations)

        // d3.selectAll(".annotation-group").remove();



    function updateSorting(sort) {

        if (sort == 0) {
            data.sort(function (a, b) {
                return a.Value - b.Value;
            });
            console.log("for sorting  ",data);

            d3.selectAll(".sort_text").transition().duration(100).remove();

        }else if (sort == 1) {
            data.sort(function (a, b) {
                return b.GDP - a.GDP;
            });
            console.log("for sorting  ",data);

            // var wrap = d3.textwrap().bounds({height: 480, width: 960});

            let sort_text_1 = svg.append("text")
            .attr("class","sort_text")
            .attr("y", height-240)
            .attr("x", 760)
            .transition().duration(5000)
            .text("We found no evident correlation")

            let sort_text_2 = svg.append("text")
            .attr("class","sort_text") 
            .attr("y", height-220)
            .attr("x", 760)
            .transition().duration(5000)
            .text("between GDP per capita and")

            let sort_text_3 = svg.append("text")
            .attr("class","sort_text") 
            .attr("y", height-200)
            .attr("x", 760)
            .transition().duration(5000)
            .text("HIV/Population ratio.")

            // .call(wrap)
            ;
            
    
        }


        x.domain(data.map(function (d) {
            return d.Country_Name;
        }));

        // // ** Map Data **
        // var circle = svg.selectAll("circle")
        // .data(data);

        // circle
        // .enter()
        // .append("circle")
        // .attr("class","circle");

        // circle
        // .merge(circle)
        // .transition()
        // .attr("cx", (d) => x(d.Country_Name))
        // .attr("cy", (d) => y(d.Value/ getPopulation(d.Country_Name)*100))
        // .attr("r", (d) => HIVScale(d.Value / getPopulation(d.Country_Name)*100))
        // .attr("opacity", 0.6)
        // .attr('fill', (d) => fill_color(d.GDP))
        // .on('mouseover', function (d) {
        //     d3.select(this)
        //         .transition(50)
        //         .style("opacity", 1)
        //         .style("transform", "translateY(-" + (HIVScale(getGDP(d.Country_Name)) / 20 + 1) +
        //             "px)");

        //     tip.show(d);
        // })
        // .on('mouseout', function (d) {
        //     d3.select(this)
        //         .transition(250)
        //         .style("opacity", 0.6)
        //         .style("transform", "translateY(0px)");;

        //     tip.hide(d);
        // });

        // ** Map Data **
        let circle = svg.selectAll("circle")
            .data(data);

        circle
            .enter()
            .append("circle")
            .attr("class", "circle");

        circle
            .merge(circle)
            .attr("opacity", 0.6)
            .attr('fill', (d) => fill_color(d.GDP))
            .on('mouseover', function (d) {
                d3.select(this)
                    .transition(50)
                    .style("opacity", 1)
                    .style("transform", "translateY(-" + (HIVScale(d.Value / d.POP) / 5 + 8) +
                        "px)");

                tip.show(d);
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .transition(250)
                    .style("opacity", 0.6)
                    .style("transform", "translateY(0px)");;

                tip.hide(d);
            })
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("cx", (d) => x(d.Country_Name))
            .attr("cy", (d) => y(d.Value / d.POP * 100))
            .attr("r", (d) => HIVScale(d.Value / d.POP * 100));

        let label = svg.selectAll("label")
            .data(data);

        label
            .enter()
            .append("label")
            .attr("class", "label");


        label
            .merge(label)
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text(function (d) {
                if (d.Value / getPopulation(d.Country_Name) > 0.1) {
                    return d.Country_Name
                }
            })
            .transition()
            .duration(1000)
            .attr("x", (d) => x(d.Country_Name))
            .attr("y", (d) => y(d.Value / getPopulation(d.Country_Name) * 100))
            .attr("fill", "gray");



        // Draw Axes
        xAxisGroup = svg.select(".x-axis")
            .attr("transform", "translate(0," + height + ")")
            .transition()
            .duration(1000)
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");


        label.exit()
            .transition()
            .remove();

        circle.exit()
            .transition()
            .remove();

    }


    function getGDP(d0) {
        let dat = GDP_data.filter(function (d) {
            return d.Country_Name == d0;
        });
        return d3.values(dat[0])[5];
    }

    function getPopulation(d0) {
        let dat = population_data.filter(function (d) {
            return d.Country_Name == d0;
        });
        return d3.values(dat[0])[5];
    }
}
