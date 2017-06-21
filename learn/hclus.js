//require('./iris_temp')

function createGround(width, height){
    var result = new Array(width);
    for (var i = 0 ; i < width; i++) {
        result[i] = new Array(height);
        for (var j = 0; j < height; j++) {
            result[i][j] = Math.random() * 10;
        }
    }
    return result;
}


var calculate_euclidean = function(d1, d2)
{
	var sum = 0;
	for(var i = 0; i < d1.length; i++)
		sum += Math.pow((d1[i] - d2[i]), 2)
	return Math.sqrt(sum);
}

var calc_dist = function(data, method)
{
	method = method || 'euclidean'
	var dist = new Array(data.length);
	for(var i = 0; i < data.length; i++)
		dist[i] = new Array(data.length);
	if(method == 'euclidean')
	{
		for(var i = 0; i < data.length; i++)
		{
			for(var j = i; j < data.length; j++)
				{
					var d = calculate_euclidean(data[i], data[j])
					dist[i][j] = d;
					dist[j][i] = d;
				}
		}
	}
	return(dist);
}

var bucket_dist = function(el1_inds, el2_inds, dist_mat)
{
	var max_dist = dist_mat[el1_inds[0]][el2_inds[0]];
	for(var i = 0; i < el1_inds.length; i++)
	{
		for(var j = 0; j < el2_inds.length; j++)	
			{
				var dis = dist_mat[el1_inds[i]][el2_inds[j]];
				if(dis > max_dist)
					max_dist = dis;
			}
	}
	return max_dist;
}

//var data = createGround(10,20);
da = iris_temp
var data = new Array(da.length);
keys = Object.keys(da[0])
for(var i = 0; i < da.length; i++)
{
	data[i] = new Array(keys.length);
	for(var j = 0; j < keys.length; j++)
		data[i][j] = da[i][keys[j]];
}
//console.log(data);
var bucket = []
//Initialisation
for(var i = 0; i < data.length; i++)
	bucket[i]  = new Node(i, data[i]);

var dist_mat = calc_dist(data)	

var merge = function(bucket, dist_mat)
{
	var cur_count = bucket.length;
	var bucket_copy = JSON.parse(JSON.stringify(bucket));
	while(bucket_copy.length >  1)
	{
		var to_clus = [bucket_copy[0], bucket_copy[1]];
		var min_dis = bucket_dist(bucket_copy[0].val_inds, bucket_copy[1].val_inds, dist_mat);	
		var to_rem = [0,1];
		for(var i = 0; i < bucket_copy.length; i++)
		{
			for(var j = i+1;  j < bucket_copy.length; j++)
			{
				 var dis = bucket_dist(bucket_copy[i].val_inds, bucket_copy[j].val_inds, dist_mat);
				 if(dis < min_dis)
				 {
				 	min_dis = dis;
				 	to_clus = [bucket_copy[i], bucket_copy[j]];
				 	to_rem = [i,j];
				 }
			}
		}
		//console.log(min_dis);
		var new_node = new Node(cur_count+1, null);
		new_node.left = to_clus[0];
		new_node.right = to_clus[1];
		new_node.height = min_dis;
		new_node.val_inds = new_node.left.val_inds.concat(new_node.right.val_inds);
		to_rem.sort(function(a,b){return b-a});
		bucket_copy.splice(to_rem[0],1);
		bucket_copy.splice(to_rem[1],1);
		bucket_copy.push(new_node);
		cur_count += 1;
		//break;
	}
	return bucket_copy
}

var set_scale = function(bucket_final, padding, width, height)
{
	var n_leaves = bucket_final.val_inds.length;
	var xScale = d3.scale.linear()
				   .domain([0, n_leaves-1])
				   .range([padding, width-padding]);
	var yScale = d3.scale.linear()			   
					.domain([0, bucket_final.height])
					.range([height-padding, padding]);
	return [xScale, yScale];
}
b = merge(bucket, dist_mat)