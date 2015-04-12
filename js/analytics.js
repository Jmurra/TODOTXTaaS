////BEGIN D3 VARS/////

//Margins for Axes
var margin = {top: 20, right: 20, bottom: 30, left: 60},
            width = 800 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

//Chart
var chart = d3.select(".chart")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height +margin.top + margin.bottom)
              // .style("background-color","blue")    
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//Color Scale
var color = d3.scale.ordinal()
  .range(["#FF0000", "#E8A10C", "#6AFF0D", "#2D00E8", "#00FFE0"]);


/////END D3 VARS////


var dates = [];

$.getJSON("sampleData.json",function(response){
  response.forEach(function(item){
    dates.push(item.completed.substring(0,10));
  });

  var countData = _.countBy(dates, function(arr){
    return arr;
  }); 
  
  var data = $.map(countData,function(count,date){
    return {
      date: date,
      total: count
    };
    
  });

 

  var x = d3.time.scale()
      .domain([new Date(data[0].date), d3.time.day.offset(new Date(data[data.length - 1].date), 1)])
      .rangeRound([0, width - margin.left - margin.right]);

  var y = d3.scale.linear()
      .range([height - margin.top - margin.bottom, 0])
      .domain([0, d3.max(data, function(d) {  return d.total; })]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.days, 1)
    .tickFormat(d3.time.format('%x'))
    .tickSize(0)
    .tickPadding(8); 

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickPadding(8);

  

  var svg = d3.select('#chart').append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  
  var barWidth = width / data.length;

  svg.selectAll('.chart')
    .data(data)
  .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) { return x(new Date(d.date)); })
    .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.total)) })
    .attr("width", barWidth/2)
    .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.total) })
    .attr("fill", "tomato")

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

});


function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}