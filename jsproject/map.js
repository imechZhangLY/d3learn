console.log(d3);


var width = 1000;
var height =700;
var mymap = d3.selectAll("#mymap");
mymap.attr("width",width)
	 .attr("height",height);




// var projection = d3.geoMercator()
// 				   .center([115, 40])
// 				   .scale(100)
//     			   .translate([width/2, height/2]);//.translate([width/2, height/2]);;//.scale(100);




var projection = d3.geoOrthographic()
				   .center([0, 0])
				   .scale(300)
    			   .translate([width/2, height/2])
    			   .precision(0.6);



/*******************************旋转规则************************************
调试原点（110，45）
第一个是左右转动，经度，负数越大，越从中国向日本旋转（自东向西为负方向）
第二个是上下转动，纬度，负数越大，越从赤道向北极旋转
第三个调整南北极

在原点东边，负数增大


******************************* 旋转规则********************************/
var rotate = [255,-35,-4];
// var rotate = [0,0,0]
projection = projection.rotate(rotate);
var path4Render = d3.geoPath().projection(projection);


var locationObj = {};
// var location;
locationObj.ox = 110;
locationObj.oy = 45;
locationObj.cx = 0;
locationObj.cy = 0;
console.log(locationObj);
console.log(rotate);

$("body").on("click",function(e){
	[locationObj.cx,locationObj.cy] = projection.invert([e.clientX,e.clientY]);

	console.log(locationObj);


	var dx = locationObj.cx - locationObj.ox;
	var dy = locationObj.cy - locationObj.oy; 

	rotate[0] = rotate[0] - dx*0.3;
	rotate[1] = rotate[1] - dy*0.3;
	locationObj.ox = locationObj.cx;
	locationObj.oy = locationObj.cy;
	
	projection.rotate(rotate);


	console.log(mymap);
	mymap.selectAll("path")
		 .attr("d",path4Render);

});





var color = d3.schemeCategory20c;



// d3.json("worldsmall.json",renderMap);

d3.json("worldsmall.json",renderMap);
d3.json("china.geojson",renderMap);
mymap.append('circle')
	 .attr("cx",width/2).attr("cy",height/2)
	 .attr("r",projection.scale())
	 .attr("fill","#00d");


mymap.append('circle')
	 .attr("cx",0).attr("cy",0)
	 .attr("r",projection.scale()*0.3)
	 .attr("fill","#00d")
	 .on("click",function(){alert("点我干啥")});

function renderMap(error,root){
	mymap.selectAll("path")
		 .data(root.features)
		 .enter()
		 .append('path')
		 .attr("stroke","#000")
		 .attr("fill",function(d,i){
		 	return color[i%20];
		 })
		 .attr("stroke-width",1)
		 .attr("d", path4Render)
		 .on("click", function(d,i){
		 	d3.select(this).attr("transform",function(){
		 	});
		 });
}

function markerOnMap(){

}

