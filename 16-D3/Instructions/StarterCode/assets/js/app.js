// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top:20,
    right:40,
    bottom:60,
    left:100
};

var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top+')');

var chart = svg.append("g");

d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv("../data/data.csv",function(error,healthData){
    if (error) throw error;
    
    //console.log(healthData);

    healthData.forEach(data =>{
        
        //data.state = +data.state;
        //console.log(data.state);
        //data.abbr = +data.abbr;
        data.poverty = +data.poverty;
        //data.povertyMoe = +data.povertyMoe;
        //data.age = +data.age;
        //data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        //data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        //data.healthcareLow = +data.healthcareLow;
        //data.healthcareHigh = +data.healthcareHigh
        //data.obesity = +data.obesity;
        //data.obesityLow = +data.obesityLow;
        //data.obesityHigh = +data.obesityHigh;
        //data.smokes = +data.smokes;
        //data.smokesLow = +data.smokesLow;
        //data.smokesHigh = +data.smokesHigh;
    })

var xLinearScale = d3.scaleLinear()
    .range([0,width]);
    
var yLinearScale = d3.scaleLinear()
    .range([height,0]);
    

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var xMin;
var xMax;
var yMin;
var yMax;

xMin = d3.min(healthData,function(data){
    return +data.healthcare * 0.95;
});

xMax = d3.max(healthData,function(data){
    return +data.healthcare * 1.05;
});

yMin = d3.min(healthData, function(data){
    return +data.income * 0.98;
});

yMax = d3.max(healthData,function(data){
    return +data.income;
});

xLinearScale.domain([xMin,xMax]);
yLinearScale.domain([yMin,yMax]);

var toolTip = d3
    .tip()
    .attr("class","tooltip")
    .offset([80,-60])
    .html(function(data){
        var stateName = data.state;
        var pov = data.poverty;
        var healthcare = data.healthcare;
        return (
            stateName + '<br> Poverty: ' + pov + '%<br> HealthCare: ' + healthcare + '%'
        );
    });

chart.call(toolTip);
//console.log(healthData);
//console.log("******");


chart.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx",function(data,index){
        return xLinearScale(data.poverty)
    })
    .attr("cy",function(data,index){
        return yLinearScale(data.healthcare)
    })
    .attr("r","15")
    .attr("fill","lightblue")
    .on("mouseover",function(data){
        toolTip.show(data);
    })
    .on("mouseout",function(data,index){
        toolTip.hide(data);
    });

chart.append("text")
    .style("text-anchor","middle")
    .style("font-size","12px")
    .selectAll("tspan")
    .data(healthData)
    .enter()
    .append("tspan")
        .attr("x",function(data){
            return xLinearScale(data.poverty - 0);
        })
        .attr("y",function(data){
            return yLinearScale(data.healthcare - 0.2);
        })
        .text(function(data){
            return data.abbr
        });
chart
    .append("g")
    .attr('transform',`translate(0, ${height})`)
    .call(bottomAxis);

chart.append("g").call(leftAxis)

chart
    .append("text")
    .attr("transform","rotate(-90)")
    .attr("y",0-margin.left + 40)
    .attr("x",0-height/2)
    .attr("dy","1em")
    .attr("class","axis-text")
    .text("HealthCare")

chart
    .append("text")
    .attr(
        "transform",
        "translate(" + width / 2+ " ," + (height + margin.top + 30) + ")"
    )
    .attr("class","axis-text")
    .text("In Poverty");

});