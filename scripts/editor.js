function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, "editorDiv",  // must name or refer to the DIV HTML element
        {
          // start everything in the middle of the viewport
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          // support double-click in background creating a new node
          "clickCreatingTool.archetypeNodeData": { text: "new node" },
          // enable undo & redo
          "undoManager.isEnabled": true
        });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("saveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });

    // define the Node template
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $(go.Shape, "Circle",
          {
            name: "SHAPE",
            parameter1: 20,  // the corner has a large radius
            fill: "LightBlue",
            stroke: null,
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
            cursor: "pointer"
          }),
        $(go.TextBlock,
          {
            font: "bold 11pt helvetica, bold arial, sans-serif",
            margin: 3,
            editable: true  // editing the text automatically updates the model data
          },
          new go.Binding("text").makeTwoWay())
      );

    // unlike the normal selection Adornment, this one includes a Button
    myDiagram.nodeTemplate.selectionAdornmentTemplate =
      $(go.Adornment, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, { fill: null, stroke: "blue", strokeWidth: 2 }),
          $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
        ),
        // the button to create a "next" node, at the top-right corner
        $(go.Panel, "Vertical",
          { alignment: go.Spot.TopRight, alignmentFocus: go.Spot.Top },
          $("Button",
            {
              click: addNodeAndLink  // this function is defined below
            },
            $(go.Shape, "PlusLine", { width: 6, height: 6 })
          ), // end button
          $("Button", 
            {
              click: setInitialNode
            },
            $(go.TextBlock, "i",
              { font: "bold 10pt sans-serif", textAlign: "center" })
          ),
          $("Button", 
            {
              click: setFinalNode
            },
            $(go.TextBlock, "f",
              { font: "bold 10pt sans-serif", textAlign: "center" })
          )
        )
      ); // end Adornment

    // clicking the button inserts a new node to the right of the selected node,
    // and adds a link to that new node
    function addNodeAndLink(e, obj) {
      var adornment = obj.part;
      var diagram = e.diagram;
      diagram.startTransaction("Add State");

      // get the node data for which the user clicked the button
      var fromNode = adornment.adornedPart;
      var fromData = fromNode.data;
      // create a new "State" data object, positioned off to the right of the adorned Node
      var nodeId = myDiagram.model.nodeDataArray.length;
      var toData = { id: nodeId };
      //toData.id = myDiagram.model.nodeDataArray.length;
      var p = fromNode.location.copy();
      p.x = Math.floor(p.x);
      p.y = Math.floor(p.y);
      p.x += 200;
      toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
      toData.text = "new";
      // add the new node data to the model
      var model = diagram.model;
      model.addNodeData(toData);

      // create a link data from the old node data to the new node data
      var linkdata = {
        from: model.getKeyForNodeData(fromData),  // or just: fromData.id
        to: model.getKeyForNodeData(toData),
        text: "transition"
      };
      // and add the link data to the model
      model.addLinkData(linkdata);

      // select the new Node
      var newnode = diagram.findNodeForData(toData);
      diagram.select(newnode);

      diagram.commitTransaction("Add State");

      // if the new node is off-screen, scroll the diagram to show the new node
      diagram.scrollToRect(newnode.actualBounds);
    }

    function setInitialNode(e, button) {
      var node = button.part.adornedPart;
      var diagram = node.diagram;
      var model = diagram.model;

      var llavenodo = model.getKeyForNodeData(node.data);
      console.log("Esta es la llave: " + llavenodo);
      var data = myDiagram.model.findNodeDataForKey(llavenodo);

      if (data !== null) {
        if (data.initial == "false" || data.initial == null) {
          myDiagram.model.setDataProperty(data, "initial", "true");      
          var shape = node.findObject("SHAPE");
          if (shape === null) return;
          node.diagram.startTransaction("Change color");
          shape.fill = "red";
          node.diagram.commitTransaction("Change color");
        }

        else if (data.initial == "true") {
          myDiagram.model.setDataProperty(data, "initial", "false");      
          var shape = node.findObject("SHAPE");
          if (shape === null) return;
          node.diagram.startTransaction("Change color");
          shape.fill = "LightBlue";
          node.diagram.commitTransaction("Change color");
        }
      }
    }

    function setFinalNode(e, button) {
      var node = button.part.adornedPart;
      var diagram = node.diagram;
      var model = diagram.model;

      var llavenodo = model.getKeyForNodeData(node.data);
      console.log("Esta es la llave: " + llavenodo);
      var data = myDiagram.model.findNodeDataForKey(llavenodo);

      if (data !== null) {
        if (data.final == "false" || data.final == null) {
          myDiagram.model.setDataProperty(data, "final", "true");
          var shape = node.findObject("SHAPE");
          if (shape === null) return;
          node.diagram.startTransaction("Change color");
          shape.fill = "green";
          node.diagram.commitTransaction("Change color");
        }
        else if (data.final == "true") {
          myDiagram.model.setDataProperty(data, "final", "false");
          var shape = node.findObject("SHAPE");
          if (shape === null) return;
          node.diagram.startTransaction("Change color");
          shape.fill = "LightBlue";
          node.diagram.commitTransaction("Change color");
        }
      }
    }

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          curve: go.Link.Bezier, adjusting: go.Link.Stretch,
          reshapable: true, relinkableFrom: true, relinkableTo: true,
          toShortLength: 3
        },
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness"),
        $(go.Shape,  // the link shape
          { strokeWidth: 1.5 }),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null }),
        $(go.Panel, "Auto",
          $(go.Shape,  // the label background, which becomes transparent around the edges
            {
              fill: $(go.Brush, "Radial",
                      { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
              stroke: null
            }),
          $(go.TextBlock, "transition",  // the label text
            {
              textAlign: "center",
              font: "9pt helvetica, arial, sans-serif",
              margin: 4,
              editable: true  // enable in-place editing
            },
            // editing the text automatically updates the model data
            new go.Binding("text").makeTwoWay())
        )
      );

	// read in the JSON data from the "mySavedModel" element
    load();
}

// Show the diagram's model in JSON format
function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}

function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}


var nodes = [];
var transitions = [];

function loadData(){
  nodes = [];
  transitions = [];

  var data = document.getElementById("mySavedModel").value;
  var dataJson = JSON.parse(data);

  

  for (var i = 0; i < dataJson.nodeDataArray.length; i++) {
    var nodeInfo = {};
    nodeInfo.identifier = dataJson.nodeDataArray[i].id;
    nodeInfo.text = dataJson.nodeDataArray[i].text;
    nodeInfo.cost = 0;
    nodeInfo.visited = false;
    nodes.push(nodeInfo);
  }
  /*var commentNodes = "";
  for (var i = 0; i < nodes.length; i++) {
    commentNodes = commentNodes + (nodes[i].text + " - ID: " + nodes[i].identifier + " ||");
    document.getElementById('nodes').innerHTML = commentNodes;
  }*/



  for (var i = 0; i < dataJson.linkDataArray.length; i++) {
    var nodeTransition = {};
    nodeTransition.from = dataJson.linkDataArray[i].from;
    nodeTransition.to = dataJson.linkDataArray[i].to;
    nodeTransition.visited = false;
    nodeTransition.weight = parseInt(dataJson.linkDataArray[i].text);
    transitions.push(nodeTransition);
  }
  /*var commentTransitions = "";
  for (var i = 0; i < transitions.length; i++) {

    var fromNodeText = searchNodeText(transitions[i].from);
    var toNodeText = searchNodeText(transitions[i].to);
    
    commentTransitions = commentTransitions + ("From: " + fromNodeText + " to " + toNodeText + " || ");
    document.getElementById('transitions').innerHTML = commentTransitions;
  }*/

}


function searchNodeText (id) {
    for (var i = 0; i < nodes.length; i++) {
      //console.log(nodes[i].identifier + "->" + id);
        if (nodes[i].identifier == id){
            return nodes[i].text;
        }
    }
    return null;
}


function validarSelect (value) {
    
    if (value != "auto")
        document.getElementById("cantidad").disabled = true;
    else
        document.getElementById("cantidad").disabled = false;
}


function createGraph (theForm) {

    var originalModel = "{ \"nodeKeyProperty\": \"id\", \n\t\"nodeDataArray\": [], \n\t\"linkDataArray\": [] \n}";

    document.getElementById("mySavedModel").innerHTML = originalModel;

    try {
        myDiagram.clear();
    }
    catch (err) {
        console.log(err.message);
    }

    console.log(theForm.metodo.value);
    console.log(theForm.cantidad.value);
    if (theForm.metodo.value == "manual") {
        
    }
    else if (theForm.metodo.value == "auto") {
        var n;
        if (theForm.cantidad.value == 0) {
            n = Math.floor((Math.random() * 10) + 1);
        }
        else if (theForm.cantidad.value == 1) {
            n = Math.floor((Math.random() * 90) + 10);   
        }
        else if (theForm.cantidad.value == 2) {
            n = Math.floor((Math.random() * 90000) + 10000);
        }
        else if (theForm.cantidad.value == 3) {
            n = Math.floor((Math.random() * 9000000) + 1000000);
        }

        //createGraphAuto(theForm.cantidad.value);
        localStorage.setItem("cantidadNodos", n);
        
        createGraphAuto();
    }
}


function createGraphAuto () {

    //init();
    var cantidad = localStorage.getItem("cantidadNodos");
    //console.log(cantidad);

    var nodeDataArray = [];
    var linkDataArray = [];

    var letra1 = "";
    var letra2 = "";
    var letra3 = "";
    var letra4 = "";
    var letra5 = "";

    n = 0;

    for (var h = -1; h < 26; h++) {
        for (var i = -1; i < 26; i++) {
            for (var j = -1; j < 26; j++) {
                for (var k = -1; k < 26; k++) {
                    for (var l = 0; l < 26; l++) {
                        letra1 = String.fromCharCode(l + 65);
                        if (k >= 0)
                            letra2 = String.fromCharCode(k + 65);
                        if (j >= 0)
                            letra3 = String.fromCharCode(j + 65);
                        if (i >= 0)
                            letra4 = String.fromCharCode(i + 65);
                        if (h >= 0)
                            letra5 = String.fromCharCode(h + 65);
                        var nombre = letra5 + letra4 + letra3 + letra2 + letra1;

                        var nodeId = nodeDataArray.length;
                        var toData = { text: nombre };
                        //console.log(toData.text);
                        //nodeDataArray.push(toData);
                        myDiagram.model.addNodeData(toData);

                        n++;
                        if (n >= cantidad)
                            break;
                    }
                    if (n >= cantidad)
                        break;
                }
                if (n >= cantidad)
                    break;
            }
            if (n >= cantidad)
                break;
        }
        if (n >= cantidad)
            break;
    };

    //console.log("Antes de entrar al for");
    for (var i = 0; i < myDiagram.model.nodeDataArray.length; i++) {
        var nodoActual = myDiagram.model.nodeDataArray[i];
        var demasNodos = myDiagram.model.nodeDataArray.slice();
        demasNodos.splice(i, 1);

        var arcos = Math.floor(Math.random() * cantidad);
        //console.log("Cantidad de arcos del nodo " + nodoActual.id + ": " + arcos);
        for (var j = 0; j < arcos; j++) {
            
            var posicion = Math.floor((Math.random() * demasNodos.length));
            var nodoVecino = demasNodos[posicion];

            //console.log("From:" + nodoActual.id);
            //console.log("-To-:" + nodoVecino.id);

            var linkdata = {
                from: nodoActual.id,
                to: nodoVecino.id,
                text: Math.floor((Math.random() * 20) + 1),
                visited:false
            };
            //linkDataArray.push(linkdata);
            myDiagram.model.addLinkData(linkdata);

            demasNodos.splice(posicion, 1);
        }
    }

    save();
        
    //myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    //initAuto();
}


function createTree (theForm) {
    loadData();
    if(theForm.algoritmosBusqueda.value == 1){
        dfs_Main();
    }
    else if (theForm.algoritmosBusqueda.value == 3) {
        ids_main();
    }
    else if (theForm.algoritmosBusqueda.value == 4) {
        bfs_Main();
    }
    else if (theForm.algoritmosBusqueda.value == 6) {
        ucs_main();
    }
    else if (theForm.algoritmosBusqueda.value == 7) {
        bestFS_Main();
    }
    else if (theForm.algoritmosBusqueda.value == 9) {
        hill_climbing_main();
    }
    else if (theForm.algoritmosBusqueda.value == 10) {
        simulatedAnnealing_Main();
    }
    
    loadTree();
    
}

//name, condition, value
//from, to, value
