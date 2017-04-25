nodosAdyacentes = [];

var nodosSolucion = [];
var arcosSolucion = [];

function getNodo(identifier) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].identifier == identifier) {
			return nodes[i];	
		}
	}
	return 1;
}

function getNodobyId(identifier) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].identifier == identifier) {
			if(nodes[i].visited != true){
				nodes[i].visited = true;
				return nodes[i];	
			}	
		}
	}
	return 1;
}

function getArco(from, to) {
	for (var i = 0; i < transitions.length; i++) {
		if ((transitions[i].from == from.identifier) && (transitions[i].to == to.identifier)) {
			return transitions[i];
		}
	}
}

function desvisitar() {
	var i;
	for (i = 0; i < nodes.length; i++) {
		nodes[i].visited = false;
	}
	for (i = 0; i < transitions.length; i++) {
		transitions[i].visited = false;
	}
}


/*
getNodosAdyacentesWithHeuristic
Method getNodosAdyacentesWithHeuristic(node,goal)
root:current node
goal:final state
*/
function getNodosAdyacentesWithHeuristic(node,goal) {
  nodosAdyacentes = [];
  for (var i = 0; i < transitions.length; i++) {
    if(transitions[i].visited != true){
       	if (transitions[i].from == node.identifier) {
        	var adyacente = getNodobyId(transitions[i].to);
        	if (adyacente != 1){
    			transitions[i].visited = true;
    			adyacente.weight = heuristic(adyacente,goal);
	        	nodosAdyacentes.push(adyacente); 
	        	//arcosSolucion.push(transitions[i]);	
    		}
      	}	
    }
  }
}


function getNodosAdyacentes(node) {
	nodosAdyacentes = [];
  	for (var i = 0; i < transitions.length; i++) {
    	if(transitions[i].visited != true){
    		if (transitions[i].from == node.identifier) {
    			var adyacente = getNodo(transitions[i].to);	
    			if (adyacente != 1){
    				transitions[i].visited = true;
	        		nodosAdyacentes.push(adyacente);
	        		//arcosSolucion.push(transitions[i]);
    			}
      		}
    	}
  	}
}



function getNodosAdyacentes_js(node) {
  	nodosAdyacentes = [];
  	for (var i = 0; i < transitions.length; i++) {
    	if(transitions[i].visited != true){
    		if (transitions[i].from == node.identifier) {
    			var adyacente = getNodobyId(transitions[i].to);	
    			if (adyacente != 1){
    				transitions[i].visited = true;
	        		nodosAdyacentes.push(adyacente);
	        		//arcosSolucion.push(transitions[i]);
    			}
      		}
    	}
  	}
}

/*
Algorithms Depth-First Search (DFS)
Method parameters(root,goal)
root:initial state
goal:final state
*/
function dfs(root, goal){
	nodosSolucion = [];
	arcosSolucion = [];

	var stack = [root];
    nodes[0].visited = true;
    nodosSolucion.push(root);


    while (stack.length > 0){
	    var nodeIndex = stack.pop();
	 
	    console.log(nodeIndex);
	    if (nodeIndex == goal) {
	    	buildJSONTree();
	        return;
	    }
	    getNodosAdyacentes_js(nodeIndex);
	   
	    for (var i = 0; i < nodosAdyacentes.length; i++) {
	    	console.log("Extiende: " + nodosAdyacentes[i].text);
	    	var arco = getArco(nodeIndex, nodosAdyacentes[i]);
			arcosSolucion.push(arco);
	        stack.push(nodosAdyacentes[i]);
	      	nodosSolucion.push(nodosAdyacentes[i]);
 
	    }

	    
  	}

}

/*
Main of Algorithms Depth-First Search (DFS)
*/
function dfs_Main(){
	dfs(nodes[0],nodes[nodes.length-1]);
}



/*
	Algoritmo Iterative Deepening Search
	root: initial state
	goal: final state
	limit: search limit of depth tree
*/
function ids(root, goal, limit){
	nodosSolucion = [];
	arcosSolucion = [];

	var node;
	var depth;
	var to;

	var s_p = new Array();
	var sd_p = new Array();

	s_p.push(root);
	sd_p.push(0);
	nodosSolucion.push(root);

	while(s_p.length > 0) {
		node = s_p.pop();
		depth = sd_p.pop();
		console.log(node.text + " en la profundidad " + depth);

		if (node == goal) {return 1};
		if (depth < limit) {
			getNodosAdyacentes(node);
			for (to = nodosAdyacentes.length - 1; to >= 0; to--) {
				var arco = getArco(node, nodosAdyacentes[to]);
				arcosSolucion.push(arco);
				s_p.push(nodosAdyacentes[to]);
				sd_p.push(depth+1);
				nodosSolucion.push(nodosAdyacentes[to]);
			}
		}
	}
	return 0;
}

function ids_main() {
	var status;
	var depth = 1;
	while(depth < 10) {
		console.log(nodes[0].text + " es el nodo inicial");
		console.log(nodes[nodes.length - 1].text + " es el nodo final");
		desvisitar();
		status = ids(nodes[0], nodes[nodes.length - 1], depth);
		if (status == 1) {
			buildJSONTree();
			break;
		}
		else
			depth++;
	}
	return;
}



/*
Algorithms Breadth-First Search (BFS)
Method parameters(root,goal)
root:initial state
goal:final state
*/
function bfs(root,goal){
	nodosSolucion = [];
	arcosSolucion = [];

	var queue = [root];
	nodes[0].visited = true;
	nodosSolucion.push(root);
	while (queue.length > 0){
	    var nodeIndex = queue.shift();
	  
	    console.log(nodeIndex);
	    if (nodeIndex == goal) {
	    	buildJSONTree();
			return;
		}
		getNodosAdyacentes_js(nodeIndex);
	    for (var i = 0; i < nodosAdyacentes.length; i++) {
	    	var arco = getArco(nodeIndex, nodosAdyacentes[i]);
			arcosSolucion.push(arco);
			console.log("Expande: " + nodosAdyacentes[i].text);
			queue.push(nodosAdyacentes[i]);
			nodosSolucion.push(nodosAdyacentes[i]);
				        
	    }

	    
	}

}
/*
Main of Breadth-First Search (BFS)
*/
function bfs_Main(){
	bfs(nodes[0],nodes[nodes.length-1]);
}



/*
	Priority Queue Class
*/
function PQueue() { 
	this.stac = new Array();
 
 	this.dePQueue = function() {
  		return this.stac.pop();
 	} 
 	
 	this.enPQueue = function(item) {
 		/*for (var i = 0; i < this.stac.length; i++) {
 			if (true) {}
 		}*/
  		this.stac.unshift(item);
  		//console.log("Cola sin prioridad" + this.stac);
  		this.stac.sort(this.PSort);
  		//console.log(this.stac);
 	}
 	
 	this.PSort = function(elem1, elem2) {
 		return (elem2.cost - elem1.cost);
	}

	this.isEmptyPQueue = function() {
		if (this.stac.length > 0)
			return false;
		else
			return true;
	}
}


/*
	Uniform Cost Search Algorithm
	root: initial state
	goal: final state
*/
function ucs(root, goal) {
	nodosSolucion = [];
	arcosSolucion = [];

	var node;
	var cost;
	var child_cost;
	var to;

	var q_p = new PQueue();

	root.cost = 0;
	q_p.enPQueue(root);
	nodosSolucion.push(root);

	while(!q_p.isEmptyPQueue()) {
		node = q_p.dePQueue();
		cost = node.cost;
		if (node.identifier == goal.identifier) {
			console.log("Costo: " + cost);
			return 1;
		}
		getNodosAdyacentes(node);
		for (to = nodosAdyacentes.length - 1; to >= 0; to--) {
			var arco = getArco(node, nodosAdyacentes[to]);
			arcosSolucion.push(arco);
			child_cost = arco.weight;
			nodosAdyacentes[to].cost = child_cost + cost;
			q_p.enPQueue(nodosAdyacentes[to]);
			nodosSolucion.push(nodosAdyacentes[to]);
			console.log(nodosAdyacentes[to].text + " pesa " + nodosAdyacentes[to].cost);
		}
	}
	return 0;
}

function ucs_main() {
	console.log(nodes[0].text + " es el nodo inicial");
	console.log(nodes[nodes.length - 1].text + " es el nodo final");
	desvisitar();
	var state = ucs(nodes[0], nodes[nodes.length - 1]);
	if (state == 1)
		buildJSONTree();
	else
		alert("No se ha encontrado solución");
	return;
}


/*
	Heuristic
	current: current state
	goal: final state
	Return an estimate cost depending on the distante between current state and final state position in the nodes list
*/
function heuristic(current, goal){
	var indexCurrent;
	var indexGoal;
	for(var i = 0; i < nodes.length; i++) {
		if (nodes[i].identifier == current.identifier) {
			indexCurrent = i;
		}
		if (nodes[i].identifier == goal.identifier) {
			indexGoal = i;
		}
	}
	var indexDistance = Math.abs(indexGoal - indexCurrent);
	var aproximateToGoal = Math.ceil(indexDistance / 2) * 10;
	return aproximateToGoal;
}



/*
Algorithms BEST-FIRST SEARCH (BEST-FS)
Method parameters(root,goal)
root:initial state
goal:final state
*/
function bestFS(root, goal){
	nodosSolucion = [];
	arcosSolucion = [];
	var stack = [root];
	var nodeMin;
	var nodeTemp;
	nodes[0].visited = true;
	nodosSolucion.push(root);


	while (stack.length > 0){
	    var nodeIndex = stack.pop();


	    if (nodeIndex == goal) {
		    buildJSONTree();
		    return;
		}
	    getNodosAdyacentesWithHeuristic(nodeIndex,goal);
	    console.log(nodeIndex);
	    if(nodosAdyacentes.length > 0){
	      	weightMin = 1000;
	      	for (var i = 0; i < nodosAdyacentes.length; i++) {
		       
		        if (nodosAdyacentes[i].weight < weightMin){
		          weightMin = nodosAdyacentes[i].weight;
		          nodeMin = nodosAdyacentes[i];
		        }
	      	}
	      
	      	var arco = getArco(nodeIndex, nodosAdyacentes[i]);
			arcosSolucion.push(arco);
	      	stack.push(nodeMin);
	      	nodosSolucion.push(nodeMin);
	      	
	      	
	    }  
	}
}

/*
Main of Breadth-First Search (BFS)
*/
function bestFS_Main(){
	bestFS(nodes[0],nodes[nodes.length-1]);
}


/*
	Hill Climbing Algorithm
	root: initial state
	goal: final state
*/
function hill_climbing(root, goal) {
	var node;
	var currentEvaluation;
	var nextEvaluation;
	var localOptimum;
	var isBetter = false;

	var s_p = new Array();

	s_p.push(root);
	currentEvaluation = heuristic(root, goal);
	console.log("Entró " + root.text);

	while(s_p.length > 0) {
		node = s_p.pop();

		if (node.identifier == goal.identifier) 
			return 1;
		
		getNodosAdyacentes(node);
		
		if (nodosAdyacentes.length > 0) {
			for (var to = nodosAdyacentes.length - 1; to >= 0; to--) {
				nextEvaluation = heuristic(nodosAdyacentes[to], goal);
				console.log("La estimación de " + nodosAdyacentes[to].text + " a " + goal.text + " es " + nextEvaluation);
				if (nextEvaluation < currentEvaluation) {
					currentEvaluation = nextEvaluation;
					localOptimum = nodosAdyacentes[to];
					isBetter = true;

				}
			}
			if (isBetter) {
				console.log(localOptimum.text + "es mejor=" + isBetter + " que " + node.text);
				s_p.push(localOptimum);
				console.log("Entró " + localOptimum.text);
				isBetter = false;
			}
		}
	}
	return 0;
}

function hill_climbing_main() {
	console.log(nodes[0].text + " es el nodo inicial");
	console.log(nodes[nodes.length - 1].text + " es el nodo final");
	desvisitar();
	var status = hill_climbing(nodes[0], nodes[nodes.length - 1]);
	if (status == 0)
		console.log("No encontró solución");
	return;
}



/*
Algorithms Simulated Annealing(SA)
Method parameters(root,goal)
root:initial state
goal:final state
*/
function simulatedAnnealing(root, goal){
 	nodosSolucion = [];
	arcosSolucion = [];

 	var stack = [root];
  	var nodeMin;
  	var nodeTemp;
  	nodes[0].visited = true;
  	nodosSolucion.push(root);

	while (stack.length > 0){
	    var nodeIndex = stack.pop();
		
	    getNodosAdyacentesWithHeuristic(nodeIndex,goal);
	    console.log(nodeIndex);
	    if(nodosAdyacentes.length > 0){
	      	weigMin = 1000;
	      	for (var i = 0; i < nodosAdyacentes.length; i++) {
		        var randomNeighbour = Math.floor(Math.random() * 10) + 1;
		        
		        if (nodosAdyacentes[i] == goal) {
			    	console.log("ENTRE ALSDKFALSDFJLAS");
				    buildJSONTree();
				    return;
				}

		        if(nodosAdyacentes[i].weight > randomNeighbour){
		          	nodeTemp = nodosAdyacentes[i];
		        }

		        if (nodeTemp != null) {
		          	if (nodeTemp.weight < weigMin){

			            weightMin = nodeTemp.weight;
			            nodeMin = nodeTemp;
			            console.log("Prueba" + nodeMin.text);
			        }

		        }

	    
	      	}
	      	var arco = getArco(nodeIndex, nodosAdyacentes[i]);
			arcosSolucion.push(arco);
	      	stack.push(nodeMin);
	      	nodosSolucion.push(nodeMin);
	    }  
	}


}

/*
Main of Simulated Annealing
*/
function simulatedAnnealing_Main(){
	simulatedAnnealing(nodes[0],nodes[nodes.length-1]);
}

/*Método DLS
node: initial state
objetive: final state
size: max calls to the function to search a solution
*/
function busquedaDls(node, objetive, size) {
	if (node == objetive){
		nodosSolucion.push(retornarNodo(node));
		buildJSONTree();
		//controlNodos(node, closedNodes, openedNodes);
	    //mostrarNodos(openedNodes, 'openedNodes');
	    //mostrarNodos(closedNodes, 'closedNodes');
	    return;
  	}
  	if (size == 0) {
  		//mostrarNodos(openedNodes, 'openedNodes');
	    //mostrarNodos(closedNodes, 'closedNodes');
	    return;
  	}
  	else {
    	//controlNodos(recorridoAdelante(node), openedNodes, closedNodes);
		//console.log("Abriendo: " + recorridoAdelante(node));
		//controlNodos(node, closedNodes, openedNodes);
		console.log("Cerrando: " + node);
		nodosSolucion.push(retornarNodo(node));
		console.log(retornarNodo(node));
    	busquedaDls(recorridoAdelante(node), objetive, size - 1);
	}
	return;
}

function retornarNodo(node){
	var nodo;
	for (var i = 0; i < nodes.length; i++) {
		if (searchNodeText(nodes[i].identifier) == node) {
			return nodes[i];
		}
	}
	return;
}

var openedNodes = [];
var closedNodes = [];
var visitedNodes = [];
var arcos = [];
var size; var limit;

/*Método de Búsqueda Bidireccional
node: initial state
objetive: final state
*/
function busquedaBidireccional(node, objetive) {
 	  if (node == objetive) {
 	    //controlNodos(node, closedNodes, openedNodes);
 	    nodosSolucion.push(retornarNodo(node));
 	    buildJSONTree();
	    //mostrarNodos(openedNodes, 'openedNodes');
	    //mostrarNodos(closedNodes, 'closedNodes');
	    return;
  	}
  	if (validar(objetive, visitedNodes) == true) {
  		nodosSolucion.push(retornarNodo(objetive));
  		//controlNodos(objetive, closedNodes, openedNodes);
	    //mostrarNodos(openedNodes, 'openedNodes');
	    //mostrarNodos(closedNodes, 'closedNodes');
	    return;
  	}
  	else {
	    //controlNodos(recorridoAdelante(node), openedNodes, closedNodes); controlNodos(recorridoAtrás(objetive), openedNodes, closedNodes);
	    console.log("Abriendo: " + recorridoAdelante(node) + ", " + recorridoAtrás(objetive));
	    //controlNodos(node, closedNodes, openedNodes); controlNodos(objetive, closedNodes, openedNodes);
	    console.log("Cerrando: " + node + ", " + objetive);
	    nodosSolucion.push(retornarNodo(node)); nodosSolucion.push(retornarNodo(objetive));
	    llenarListaNodosBi(node, visitedNodes);
	    busquedaBidireccional(recorridoAdelante(node), recorridoAtrás(objetive));
  	}
  	return;
}

function dls(){
	nodosSolucion = [];
	arcosSolucion = [];
	size = nodes.length - 1;
	busquedaDls(nodes[0].text, nodes[nodes.length - 1].text, size);
}

function bi(){
	nodosSolucion = [];
	arcosSolucion = [];
    closedNodes = []; openedNodes = [];
  	busquedaBidireccional(nodes[0].text, nodes[nodes.length - 1].text);
}

function aAs(){
	nodosSolucion = [];
	arcosSolucion = [];
  	closedNodes = [];
	closedNodes.push(nodes[0].text);
	//controlNodos(nodes[0].text, closedNodes, openedNodes);
	busquedaAstar(nodes[0].text, nodes[nodes.length - 1].text);
}

var abiertosAstar = []; var cerradosAstar = [];
var cost; var cantidadNodos;

/*
Búsqueda A*
node: initial state
objetive: final state
*/
function busquedaAstar(node, objetive){
	var menor = "";
	var distancia = 10000000000;
	if (node == objetive) {
		nodosSolucion(retornarNodo(node));
		buildJSONTree();
		//mostrarNodos(openedNodes, 'openedNodes');
		//mostrarNodos(closedNodes, 'closedNodes');
		return;
	}
		
	else {
		controlNodosAstar(node, abiertosAstar, cerradosAstar);
		console.log("Expandiendo: " + node);
		recorridoAnchura(node);
		if (arcos.length != 0) {
			for (var i = 0; i < arcos.length; i++) {
				//controlNodosAstar	(arcos[i].para, openedNodes, openedNodes);
				//openedNodes.push(arcos[i].para);
				arcosSolucion.push(arcos[i]);
				console.log("Nodo " + arcos[i].para);
				cost = 0; cantidadNodos = 0;
				if (arcos[i].para == objetive) {
					return;
				}
				limit = nodes.length * (nodes.length - 1);
				var temporal = heurísticaAstar(arcos[i].para, arcos[i].costo, objetive, limit);
				if ( temporal < distancia && temporal  > 0) {
					menor = arcos[i].para;
					console.log("Menor: " + arcos[i].para);
					distancia = temporal;
					console.log("Distancia: " + temporal);
					cerradosAstar = [];
				}
			}
			//controlNodos(menor, closedNodes, openedNodes);
			//closedNodes.push(menor);
			nodosSolucion.push(retornarNodo(menor));
		}
		else {
			return;
		}
		busquedaAstar(menor, objetive);
		return;
	}
	console.log(menor);
	console.log(distancia);
	return;
}
	

function heurísticaAstar(node, coste, objetive, limit){
	if (node == objetive){
		nodosSolucion.push(retornarNodo(node));
		cost = (cantidadNodos * 10) + coste;
		buildJSONTree();
	    return  cost;
  	}
	if (buscarObjetivo(node, objetive) == objetive) {
		console.log("Abriendo: " + buscarObjetivo(node, objetive));
		cantidadNodos++;
		cost + heurísticaAstar(buscarObjetivo(node, objetive), coste, objetive, limit - 1);

	}
  	if (limit == 0) {
  		cost = 0;
	    return cost;
  	}
	if (validar(recorridoAdelante(node), cerradosAstar) != true) {
		//controlNodosAstar(node, abiertosAstar, cerradosAstar);
		cantidadNodos++;
		console.log("Abriendo: " + recorridoAdelante(node));
		cost + heurísticaAstar(recorridoAdelante(node), coste, objetive, limit - 1);
	}
	return cost;
}

function buscarObjetivo(node, objetive){
	for (var i = 0; i < transitions.length; i++) {
	    if (searchNodeText(transitions[i].from) == node && searchNodeText(transitions[i].to) == objetive) {
	      return searchNodeText(transitions[i].to);
	    }
  	}
  	return null;
}

function recorridoAdelante(node) {
  	for (var i = 0; i < transitions.length; i++) {
	    if (searchNodeText(transitions[i].from) == node && validar(searchNodeText(transitions[i].to), closedNodes) == false) {
	    	arcosSolucion.push(transitions[i]);
	    	console.log(transitions[i]);
	      	return searchNodeText(transitions[i].to);
	    }
  	}
}

function recorridoAtrás(node) {
	for (var i = 0; i < transitions.length; i++) {
	    if (searchNodeText(transitions[i].to) == node && validar(searchNodeText(transitions[i].to), closedNodes) == false) {
	    	arcosSolucion.push(transitions[i]);
	    	console.log(transitions[i]);
	      	return searchNodeText(transitions[i].from);
	    }
  	}
}

function recorridoAnchura(node){
	for (var i = 0; i < transitions.length; i++) {
		var arco = {};
		if (searchNodeText(transitions[i].from) == node) {
	      arco.de = searchNodeText(transitions[i].from);
	      arco.para = searchNodeText(transitions[i].to);
	      arco.costo = transitions[i].cost;
	      arcos.push(arco);
	    }
	}
}
/*
function mostrarNodos(array, htmlE) {
  	var message = "";
  	for (var i = 0; i < array.length; i++) {
    	message = message + array[i] + " ";
    	document.getElementById(htmlE).innerHTML = message;
  	}
}*/

function controlNodos(node, arrayOne, arrayTwo) {
  	var control = false;
  	for (var i = 0; i < arrayOne.length; i++) {
	    if (arrayOne[i] == node)
	      control = true;
  	}
  	if (control == false) {
	    for (var i = 0; i < arrayTwo.length; i++) {
	      if (arrayTwo[i] == node) {
	        arrayTwo.splice(i, 1);
	      }
	    }
    	arrayOne.push(node);
  	}
}

function llenarListaNodosBi(node, array){
	var control = false;
	for (var i = 0; i < array.length; i++) {
		if (array[i] == node) {
			control = true;
		}
	}
	if (control == false) {
		array.push(node);
	}
}

function validar(node, array){
	var control = false;
	for (var i = 0; i < array.length; i++) {
		if (array[i] == node) {
			control = true;
		}
	}
	return control;
}

function controlNodosAstar(node, arrayOne, arrayTwo){
	var control = false;
  	for (var i = 0; i < arrayOne.length; i++) {
	    if (arrayOne[i] == node)
	      control = true;
  	}
  	if (control == false) {
    	arrayTwo.push(node);
  	}
}