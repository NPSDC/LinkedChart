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


function Node(id)
{
  this.id = id;
  this.left = null;
  this.right = null;
  this.left_height = null;
  this.right_height = null;
  this.parent = null;
  this.cum_height = 0;
  this.x = null;
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
		this.curNode.right_height = right_height;
		this.curNode.right.parent = this.curNode;
		this.curNode.right.cum_height = this.curNode.cum_height + this.curNode.right_height
	}
	this.add_left = function(id, left_height)
	{
		this.curNode.left = new Node(id);
		this.curNode.left_height = left_height;
		this.curNode.left.parent = this.curNode;
		this.curNode.left.cum_height = this.curNode.cum_height + this.curNode.left_height
	}
	this.move = function(node)
	{
		this.curNode = node;
	}

}

var n_leaf = 0;
var set_x =	function(node, scale)
	{
		if(node.right == null && node.left == null)
		{
			node.x = scale*n_leaf + scale;
			n_leaf++;
			return;
		}
		if(node.left.x == null)
			set_x(node.left, scale);
		if(node.right.x == null)
			set_x(node.right, scale);
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


