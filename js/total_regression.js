/**
 * Created by nicholasstellitano on 7/8/15.
 */

Total_Regress = function(raw_data, parentElement, EventHandler) {
    this.data = raw_data;
    this.parentElement = parentElement;
    this.eventHandler = EventHandler;
    this.displayData = [];


    this.width = 400;
    this.height = 400;

    this.wrangleData();
}

Total_Regress.prototype.initVis =function() {
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("class", "graph");

    this.x = d3.scale.linear()
        .range([0, this.width-40]);

    this.y = d3.scale.linear()
        .range([this.height-40,0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(30,10)")
        .style("font-size", "13px")
        .style("font-family", "Lato");


    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(30,370)")
        .style("font-size", "13px")
        .style("font-family", "Lato");

    this.updateVis();

}

Total_Regress.prototype.updateVis =function() {
    var that = this;

    // updates scales
    this.x.domain([-4, 4]);

    this.y.domain([-10, 30]);

    // updates axis
    this.svg.select(".y.axis")
        .call(this.yAxis)

    this.svg.select(".x.axis")
        .call(this.xAxis)

    var dots = this.DataEnterExit();

    var countx = -1;
    var county = -1;
    dots.select("circle")
        .transition()
        .attr("cx", function (d, i) {
            countx++;
            return that.x(that.displayData[countx].ses);
        })
        .attr("cy", function (d, i) {
            county++;
            return that.y(that.displayData[county].mathach);
        })
        .style("fill", "black")
        .attr("r", 1);

}


Total_Regress.prototype.wrangleData =function() {
    var that = this;

    for (var i = 0; i < that.data.length; i++) {
        that.displayData[i] = {
            "id": i,
            "schoolid": that.data[i]["SCHOOLID"],
            "mathach": that.data[i]["MATHACH"],
            "ses": that.data[i]["SES"]
        }
    }

    that.initVis()
}

Total_Regress.prototype.totalAverage =function() {
    var that = this;

    for (var i = 0; i < that.data.length; i++) {
        that.displayData[i] = {
            "id": i,
            "schoolid": that.data[i]["SCHOOLID"],
            "mathach": that.data[i]["MEANMATH"],
            "ses": that.data[i]["MEANSES"]
        }
    }

    var dots = this.DataEnterExit();

    dots.select("circle")
        .transition()
        .delay(function(d, i) { return i * .5; })
        .style("fill", "red")
}

Total_Regress.prototype.averageCollapse = function(){
    that = this;

    var dots = this.DataEnterExit();

    var countx = -1;
    var county = -1;
    dots.select("circle")
        .transition()
        .attr("cx", function (d, i) {
            countx++;
            return that.x(that.displayData[countx].ses)
        })
        .attr("cy", function (d, i) {
            county++;
            return that.y(that.displayData[county].mathach)
        })
        .attr("r", 3);

}




//-----------------Helper Functions---------------------------
Total_Regress.prototype.DataEnterExit = function() {
    that = this;
    var dots = this.svg.selectAll(".circle")
         .data(that.displayData, function (d) {
             return d.id
         });

     dots.enter().append("g").append("circle")

     dots
         .attr("class", "circle")

     dots.exit()
         .remove();

    return dots;
}