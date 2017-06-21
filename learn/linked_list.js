/*function linked_list()
{
	return{

	}
};*/
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

var n_count = 0;
var set_x =	function(node)
{
	if(node.right == null && node.left == null)
	{
		node.x = n_count;
		n_count++;
		return;
	}
	if(node.left.x == null)
		set_x(node.left);
	if(node.right.x == null)
		set_x(node.right);
	node.x = (node.right.x + node.left.x)/2 ;
	return;
}

var traverse = function(node)
{
	//console.log(node.id);
	//if(node == null)
	//	return;
	if(node.left == null && node.right == null)
		console.log(node.id, node.cum_height);
	var children = [node.left, node.right];
	for(var i = 0; i < children.length; i++	)
	{
		if(children[i] != null)
				traverse(children[i]);
	}
	return;
};


var draw_dendo = function(node, svg, scales, padding)
{
	var height = svg.style()[0][0].getAttribute("height");
	if(node.right != null && node.left != null)
	{
		svg.append("line")
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
			svg.append("line")
			.attr("x1", scales[0](children[i].x))
			.attr("x2", scales[0](children[i].x))
			.attr("y1",  scales[1](node.height))
			.attr("y2", scales[1](children[i].height))
			.attr("id", children[i].id)
			.attr("orient", "v")
			.attr("class", "normal");
		}
		
		draw_dendo(node.left, svg, scales, padding);
		draw_dendo(node.right, svg, scales, padding);
	}

   	if(node.left == null && node.right == null)
   	{
	   	svg.append("text")
	   	.attr("x", scales[0](node.x ))
	   	.attr("y", scales[1](node.height) + padding)
	   	.text(String(node.id))
	   	.attr("text-anchor", "middle")
	   	//.attr("font-family", "sans-serif")
   		//.attr("font-size", scale)
   		.attr("fill", "red");
   		//.attr("transform", "rotate(45 -10 10)");
   }

	return;
}

var find_node = function(node, id)
{	
	if(node != null)
	{
		if(node.id == id)
			return node;
		else 
			return find_node(node.left,id) || find_node(node.right, id);
	}
	return null;
}

var check_ele = function(ele, ind_arr)
{
	for(var i = 0; i < ind_arr.length; i++)
	{
		if(ind_arr[i] == ele)
			return true;
	}
	return false;
}
var change_prop = function(root_node, id_and_type, svg, cla)
{
	//console.log(root_node);
	node_req = find_node(root_node, id_and_type[0]);
	inds = [];
	var prop = -1;
	
	add_ids(node_req, inds);
	
	if(id_and_type[1] == 'h')
		prop = id_and_type[0];

	set_color(svg, [], cla, -1);
	set_color(svg, inds, cla, prop);

}

var set_click = function(root, svg, cla)
{
	d3.selectAll('line').on('click', function(d){
	change_prop(root, [this.getAttribute('id'), this.getAttribute('orient')], svg, cla);});
}

var add_ids = function(node, inds)
{
	inds.push(node.id);
	if(node.left != null)
		add_ids(node.left, inds);
	if(node.right != null)
		add_ids(node.right, inds);
}

var set_color = function(svg, inds, cla, prop)
{
	svg.selectAll('line').attr("class", function(d)
	{
		return check_ele(this.id, inds) ? cla[1]:cla[0];
	});
}


//Issue of Memory vs time