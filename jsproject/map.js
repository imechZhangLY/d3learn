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
// var rotate = [255,-35,0];
var rotate = [0,0,0]
projection = projection.rotate(rotate);
var path4Render = d3.geoPath().projection(projection);


var locationObj = {};
// var location;
locationObj.ox = 110;
locationObj.oy = 45;
locationObj.cx = 0;
locationObj.cy = 0;


// $("#mymap").on("click",function(e){
// 	[locationObj.cx,locationObj.cy] = projection.invert([e.offsetX, e.offsetY]);
// 	d3.transition()
// 	  .duration(600)
// 	  .tween("rotate", function(){
// 	  	//console.log([locationObj.cx,locationObj.cy]);
// 	  	r = d3.interpolate(projection.rotate(), [-locationObj.cx,-locationObj.cy]);
// 		return function(t) {
// 			projection.rotate(r(t)).scale(300);
// 			mymap.selectAll("path")
// 				 .attr("d",path4Render);
// 		}
// 	  });
// });





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
		 .attr("d", path4Render);
}

function markerOnMap(){

}
function drag(lastPoint,currentPoint){
	var coor,coor1
	console.log(lastPoint)
	coor = projection.invert(lastPoint)
	coor1 = projection.invert(currentPoint)
	console.log(lastPoint)
	if(whichAxis(currentPoint,lastPoint) === 0){
		//转纬度
		if(currentPoint[1] > lastPoint[1]){
			deg[1] -= Math.abs(coor1[1] - coor[1])
		}else{
			deg[1] += Math.abs(coor1[1] - coor[1])
		}
	}else{
		//转经度
		coor = toPositive(coor)
		coor1 = toPositive(coor1)
		deg[0] += coor1[0] - coor [0]
	}
	projection.rotate(deg)
	mymap.selectAll("path").attr("d",path4Render);
}

var initialPoint = null, lastPoint = null,deg = [0,0]
$("#mymap").on('mousedown' ,function(e){
	initialPoint = [e.offsetX, e.offsetY]
	lastPoint = initialPoint
})
$("#mymap").on('mouseup' ,function(e){
	initialPoint = null
})

$("#mymap").on('mousemove',function(e){
	var currentPoint = [e.offsetX, e.offsetY]
	if(!initialPoint || dis(currentPoint,lastPoint) < 10){
		return
	}
	drag(lastPoint,currentPoint)
	lastPoint = currentPoint
})

function dis(point1,point2){
	return Math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)
}

function toPositive(arr){
	result = [arr[0], arr[1]]
	if(arr[0] < 0){
		result[0] += 360
	}
	return result
}
function whichAxis(currentPoint,lastPoint){
	if(Math.abs(lastPoint[1] - currentPoint[1]) > Math.abs(lastPoint[0] - currentPoint[0])){
		return 0 //纬度转
	}else{
		return 1 //转经度
	}
}

