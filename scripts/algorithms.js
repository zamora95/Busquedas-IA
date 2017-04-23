nodosAdyacentes = [];

function getNodobyId(identifier) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].identifier == identifier) {
			return nodes[i];
		};
	}
}

function getNodosAdyacentes(node) {
	nodosAdyacentes = [];
	var id = node.identifier;
	//console.log("Los vecinos de " + node.text + " son: ")
	for (var i = 0; i < transitions.length; i++) {
		if (transitions[i].from == id) {
			var adyacente = getNodobyId(transitions[i].to);
			nodosAdyacentes.push(adyacente);
			//console.log(adyacente.text + ", ");
		};
	}
}

function ids(root, goal, limit){
	var node;
	var depth;
	var to;

	var s_p = new Array();
	var sd_p = new Array();

	s_p.push(root);
	sd_p.push(0);

	while(s_p.length > 0) {
		node = s_p.pop();
		depth = sd_p.pop();
		console.log(node.text + " en la profundidad " + depth);

		if (node == goal) {return 1};
		if (depth < limit) {
			getNodosAdyacentes(node);
			for (to = nodosAdyacentes.length - 1; to >= 0; to--) {
				s_p.push(nodosAdyacentes[to]);
				sd_p.push(depth+1);
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
		console.log(nodes[nodes.length - 1].text + " es el nodo final")
		status = ids(nodes[0], nodes[nodes.length - 1], depth);
		if (status == 1)
			break;
		else
			depth++;
	}
	return;
}