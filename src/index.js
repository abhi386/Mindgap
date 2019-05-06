//import  'd3-tip';
import * as d3 from 'd3';
import $ from 'jquery';
//import 'bootstrap';

//import "css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'webpack-icons-installer/bootstrap';
import './css/style.css';
import './css/d3-tip.css';
import * as page from './page';
//import * as tip from './d3-tip';

//tip = d3.tip();

page.addNavbar();

// set margin
var margin = {left:100, right:10, top:10, bottom:100 };
var height = 400 - margin.top - margin.bottom;
var width = 800 - margin.left - margin.right;


var time = 0;
var interval;
var formattedData;


//set scale
var x= d3.scaleLog()
        .base(10)
        .range([0,width])
        .domain([100,165000]);
        

var y = d3.scaleLinear()
          .range([height,0])  
          .domain([0,90]) ;       
        
var area = d3.scaleLinear()
          .range([25*Math.PI, 1500*Math.PI])
          .domain([2000, 1400000000]);

var Ccolors =  d3.scaleOrdinal(d3.schemePastel1) 
                       

// End of Scales

//Groups and Margin

var g = d3.select("#chart-area")
    .append("svg")
    .attr("height",height + margin.top + margin.bottom )
    .attr("width",width + margin.left + margin.right )
    .append("g")
    .attr("transform","translate(" + margin.left +","+ margin.top +")");

//Tooltip rendering. 
//Initialize the tooltip

// tip_func = d3.tip().attr("class", "d3-tip")
//               .html(function(d){
//                   return d;
//               });

//calling tooltip in the context of visualization
// g.call(tip);


//Axis and Labels
//y-axis
var leftAxis = d3.axisLeft(y)
                .ticks(7);
                
                g.append("g")
                 .attr("class","y-axis")
                 .call(leftAxis); 
                 
//x-axis
var bottomAxis = d3.axisBottom(x)
                   //.ticks(5)
                    .tickValues([200, 400, 1000, 2000, 4000,8000,20000,40000, 80000,130000])
                   .tickFormat(d3.format("$,.0f"));

            g.append("g")
            .attr("class","x-axis")
            .attr("transform","translate(" + 0 + ","+ height + ")")
            .call(bottomAxis);
            
//Y Axis label
var axisxLabel = g.append("text")
                .attr("class","y axis-label")
                .attr("x", -height/2)
                .attr("y", -50)
                .attr("transform","rotate(-90)")
                .attr("font-size","20px")
                .attr("text-anchor","middle")
                .text("Life expectancy (years)");

//X Axis label
var axisxLabel = g.append("text")
                .attr("class","x axis-label")
                .attr("x",width/2)
                .attr("y",height + 50)
                .attr("font-size","20px")
                .attr("text-anchor","middle")
                .text("GDP per capita ($)");

//Year label
var yearLabel = g.append("text")
                .attr("class","year-label")
                .attr("x",width-70)
                .attr("y",height - 20)
                .attr("font-size","30px")
                .attr("text-anchor","middle")
                .text("1800")
                ;
 

//Legend
var continents = ["europe", "asia", "americas", "africa"];

var legend = g.append("g")
    .attr("transform", "translate(" + (width - 50) + 
        "," + (height - 125) + ")");

continents.forEach(function(continent, i){
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");

    legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", Ccolors(continent));

    legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(continent);
});   




                //Data    
 d3.json("data/data.json").then(function(data){
console.log(data);
	//Clean Data
	 formattedData = data.map(function(year){
        return year["countries"].filter(function(country){
            var dataExists = (country.income && country.life_exp);
            return dataExists
        }).map(function(country){
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;            
        })
              
	});

    console.log(formattedData); 

//first time update
update(formattedData[0]);
});

//play and pause

$("#play-button").on("click",function(){
        var button = $(this);
        if (button.text() == "Play"){
           button.text("Pause");
            interval = setInterval(step,100);
       }
        else {
           button.text("Play");
           clearInterval (interval);
        }
    })

//Reset

$("#reset-button").on("click", function(){

    time = 0;
    update(formattedData[time]);
});


//Set continent filter to work when the viz is paused
$("#continent-select").on("change", function(){

    update(formattedData[time]);
});

// $("#date-slider").slider({
//   max: 2014,
//   min: 1800,
//   step: 1,
//   slide: function(event, ui) {
//       time = ui.value - 1800;
//       console.log("*************" + ui.value);
      
//       update(formattedData[time]);
//   } 
// });
//console.log("*************"+ );
    
function step(){
    time = (time < 214) ? time + 1 : 0 
    update(formattedData[time]);
    
}



function update(data){

    var t = d3.transition().duration(100);



    // Filter Continent. Need to place it inside the update function to have the filter working.
    var continent = $("#continent-select").val();

    var data = data.filter(function(d) {
        if (continent =="all") {return true;}
        else
        {return d.continent == continent;}
    });

   //data join. Join new data with old elements if any
    var  circles = g.selectAll("circle")
    .data(data, function(d){
         return d.country; });
     
   // Exit. Remove old elements as needed.
   
   circles.exit().remove();

//Update. Update old element as needed
/*
circles.attr("cx",(d)=> {return x(d.income);})
  .attr("cy",(d)=> {return y(d.life_exp);})
  .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI); })
  .attr("fill", (d)=>{return Ccolors(d.continent);})
  .attr("opacity",0.8)
  .attr("stroke",'grey')
  .attr("stroke-width","1px");
  */
 yearLabel.text(1800+time); 
$("#year")[0].innerHTML = + (time + 1800);
//$("#date-slider").slider("value", + (time + 1800));


// Eneter new element present in our new data
   circles.enter()
  .append("circle")
  .attr("fill", (d)=>{return Ccolors(d.continent);})
  //.on("mouseover",tip_func.show)
  //.on("mouseout", tip_func.hide)
  .merge(circles)
  .transition(t)
  .attr("cx",(d)=> {return x(d.income);})
  .attr("cy",(d)=> {return y(d.life_exp);})
  .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI); })
  .attr("opacity",0.8)
  .attr("stroke",'grey')
  .attr("stroke-width","1px");
}
;


