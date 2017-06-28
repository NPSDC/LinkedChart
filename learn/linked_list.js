var intersect = function(ar1, ar2)
{
	ar_int = []
	var ar = [ar1, ar2]
	var l = [ar1.length, ar2.length];
	var ind = l.indexOf(Math.min.apply(null,l))
	var ind_large = ind == 0 ? 1:0
	for(var i = 0; i < ar[ind].length; i++)
	{
		if(ar[ind_large].indexOf(ar[ind][i]) != -1)
			ar_int.push(ar[ind][i])
	}
	return ar_int
}

function List(){
	this.start = null;
	this.end = null;
	this.makeNode = function()
	{
		return {data:null, next:null};
	};
	this.add=function (data)
	{
	 if(this.start===null)
	 { 
	   this.start = this.makeNode(); 
	   this.end = this.start;
 	 }
 	 else
 	 {
 	 	this.end.next = this.makeNode();
 	 	this.end = this.end.next;
 	 }
 	 this.end.data = data;
 	}	
}


function Node(id, val)
{
  this.id = id;
  this.val = val;
  this.left = null;
  this.right = null;
  //this.left_height = null;
  //this.right_height = null;
  this.parent = null;
  this.height = 0;
  this.x = null;
  this.val_inds = [id];

  var traverse = function()
	{
		//console.log(node.id);
		//if(node == null)
		//	return;
		if(this.left == null && this.right == null)
			console.log(this.id, this.height);
		var children = [this.left, this.right];
		for(var i = 0; i < children.length; i++	)
		{
			if(children[i] != null)
					traverse(children[i]);
		}
		return;
	};
}
     
function Tree(id)
{
	this.root = new Node(id);
	this.curNode = null;
	if(this.curNode == null)
		this.curNode = this.root;
	this.add_right = function(id, right_height)
	{
		this.curNode.right = new Node(id);
		this.curNode.right.height = right_height;
		this.curNode.right.parent = this.curNode;
		//this.curNode.right.cum_height = this.curNode.cum_height + this.curNode.right_height
	}
	this.add_left = function(id, left_height)
	{
		this.curNode.left = new Node(id);
		this.curNode.left.height = left_height;
		this.curNode.left.parent = this.curNode;
		//this.curNode.left.cum_height = this.curNode.cum_height + this.curNode.left_height
	}
	this.move = function(node)
	{
		this.curNode = node;
	}


}

var dendoGram = function(hclus_ob)
{
	var dendogram = lc.base();
	/*dendogram.add_property("check_heatmap", function(heatmap, prop_name, prop_other, defaultval)
	{
		if(prop_other == null)
			prop_other = prop_name
		if(heatmap != null)
			dendogram.add_property(prop_other, heatmap[["get_"+prop_name]]());
		else
		{
			console.log("I rock")
			dendogram.add_property(prop_other, defaultval);
		}
		return dendogram		
	})*/
	dendogram.add_property("orientation", "h")
		.add_property("height", 100)
		.add_property("width", 300)
		.add_property("hclus", hclus_ob)
		.add_property("nlabels", hclus_ob.val_inds.length)
		.add_property("labIds", function(){return undefined})
		.add_property("padding", {left:20, top:20, bottom:20, right:20})
		.add_property("heatmap")
		.add_property("css_class", ['normal', 'selected']);

	dendogram.nlabels("_override_", "labIds", function()
	{
		return d3.range(dendogram.get_nlabels());
	})
	
	var n_count = 0;		 
	dendogram.set_x = function(node)
	{ 
		if(node.right == null && node.left == null)
		{
			node.x = n_count;
			n_count++;
			return;
		}
		if(node.left.x == null)
			this.set_x(node.left);
		if(node.right.x == null)
			this.set_x(node.right);
		node.x = (node.right.x + node.left.x)/2 ;
		return;
	}
	dendogram.set_scale = function()
	{
		var t = -1;
		var rev_height = 0;
		var bucket_final = this.get_hclus(),
		 	padding = this.get_padding(),
		 	width = this.get_width(),
		 	height = this.get_height();
		var n_leaves = bucket_final.val_inds.length;
		var box_width = (width - padding.right - padding.left)/n_leaves;
		var xScale = d3.scaleLinear()
					   .domain([0, n_leaves-1])
					   .range([padding.left + box_width/2, 
					   	width - padding.right - box_width/2]);
		if(dendogram.get_orientation() == 'v')
		{	rev_height = height; t = 1;}

		var yScale = d3.scaleLinear()			   
						.domain([0, bucket_final.height])
						.range([height+padding.top*t-rev_height,
						 rev_height-padding.bottom*t]);
		return [xScale, yScale];
	}
	dendogram.draw_dendo = function(node, g, scales)
	{
		//var height = svg.style()[0][0].getAttribute("height");
		if(node.right != null && node.left != null)
		{
			g.append("line")
			.attr("x1", scales[0](node.left.x))
			.attr("x2", scales[0](node.right.x))
			.attr("y1", scales[1](node.height))
			.attr("y2", scales[1](node.height))
			.attr("id", node.id)	
			.attr("orient", "h")
			.attr("class", "normal");

			var children = [node.left, node.right];
			for(var i = 0; i < children.length; i++)
			{
				g.append("line")
				.attr("x1", scales[0](children[i].x))
				.attr("x2", scales[0](children[i].x))
				.attr("y1",  scales[1](node.height))
				.attr("y2", scales[1](children[i].height))
				.attr("id", children[i].id)
				.attr("orient", "v")
				.attr("class", "normal");
			}
			
			this.draw_dendo(node.left, g, scales);
			this.draw_dendo(node.right, g, scales);
		}
/*
	   	if(node.left == null && node.right == null)
	   	{
		   	g.append("text")
		   	.attr("x", scales[0](node.x ))
		   	.attr("y", scales[1](node.height) + padding)
		   	.text(String(node.id))
		   	.attr("text-anchor", "middle")
		   	//.attr("font-family", "sans-serif")
	   		//.attr("font-size", scale)
	   		.attr("fill", "red");
	   		//.attr("transform", "rotate(45 -10 10)");
	   }*/

		return;
	}
	dendogram.find_node = function(node, id)
	{	
		if(node != null)
		{
			if(node.id == id)
				return node;
			else 
				return dendogram.find_node(node.left,id) || dendogram.find_node(node.right, id);
		}
		return null;
	}
	dendogram.add_ids = function(node, inds)
	{
		inds.push(node.id);
		if(node.left != null)
			dendogram.add_ids(node.left, inds);
		if(node.right != null)
			dendogram.add_ids(node.right, inds);
	}

	dendogram.check_ele = function(ele, ind_arr)
	{
		for(var i = 0; i < ind_arr.length; i++)
		{
			if(ind_arr[i] == ele)
				return true;
		}
		return false;
	}

	dendogram.set_color = function(g, inds, cla, prop)
	{
		g.selectAll('line').attr("class", function(d)
		{
			return dendogram.check_ele(this.id, inds) ? cla[1]:cla[0];
		});
	}

	
	dendogram.change_prop = function(root_node, id_and_type, g, cla)
	{
		//console.log(root_node);
		node_req = dendogram.find_node(root_node, id_and_type[0]);
		inds = [];
		var prop = -1;
		
		dendogram.add_ids(node_req, inds);
		
		if(id_and_type[1] == 'h')
			prop = id_and_type[0];

		dendogram.set_color(g, [], cla, -1);
		dendogram.set_color(g, inds, cla, prop);

		var hcl = dendogram.get_heatmap()
		if(hcl != undefined)
		{
			var orientation = dendogram.get_orientation();
			if(orientation == 'h')
			{
				var inds_int = intersect(inds.map(function(e) {return e.toString()}),
					hc.get_colIds())
				hcl.clusterColIds(inds_int)
				hcl.clusterRowIds(hc.get_dispRowIds());
				hcl.cluster('Row')
				hcl.get_dendogramRow().draw();
			}
			if(orientation == 'v')
			{
				var inds_int = intersect(inds.map(function(e) {return e.toString()}),
					hc.get_rowIds())
				hcl.clusterRowIds(inds_int)
				hcl.clusterColIds(hc.get_dispColIds());
				hcl.cluster('Col')
				hcl.get_dendogramCol().draw();
			}
		}

	}

	dendogram.set_click = function(root, g, cla)
	{
		g.selectAll('line').on('click', function(d){
		dendogram.change_prop(root, [this.getAttribute('id'), this.getAttribute('orient')], g, cla);});
		return dendogram;
	}

	dendogram.draw = function()
	{
		var orientation = dendogram.get_orientation();
		dendogram.svg.select('g#'+orientation).remove()
		dendogram.g = dendogram.svg.append('g')
						.attr('id', dendogram.orientation());
		dendogram.set_x(dendogram.get_hclus());
		n_count = 0;
		dendogram.add_property("scales", dendogram.set_scale());
		dendogram.draw_dendo(dendogram.get_hclus(), dendogram.g, dendogram.get_scales() )
		if(dendogram.get_orientation() == 'v')
		{
			var temp = (dendogram.get_padding().left*-1).toString();
			dendogram.g.attr("transform", "rotate(90 0 0) translate(0"+temp+")");
		}
		dendogram.set_click(dendogram.get_hclus(), dendogram.g, dendogram.get_css_class())		
		return dendogram;
	}	
	
	dendogram.put_static_content = function(element, svg)
	{
		if(element != null)
			dendogram.container = element.append('div')
			.style("position", "relative")
		if(svg == null)
		{
			var svg = dendogram.container.append('svg')
						.attr("width", dendogram.get_width())
						.attr("height", dendogram.get_height());
		}
		dendogram.svg = svg
		dendogram.draw();
		return dendogram;		
	}	
	
	dendogram.place = function( element, svg, heat ) 
	{
		
		if(heat == true)		
			return dendogram.put_static_content(element, svg);
	    else if( element === undefined )
	      element = "body";

	    else if( typeof( element ) == "string" ) 
	    {
	      var node = element;
	      element = d3.select( node );
	      if( element.size() == 0 )
	        throw "Error in function 'place': DOM selection for string '" +
	          node + "' did not find a node."
	  	}
		dendogram.put_static_content(element, svg);
		return dendogram;
    	//chart.update();
    	//chart.afterUpdate();
  	}
  	//dendogram.set_x
	return dendogram;
}



//Issue of Memory vs time
//Think of 