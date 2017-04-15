var myDiagram;

function initAuto() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, "editorDiv",  // must name or refer to the DIV HTML element
        {
          // start everything in the middle of the viewport
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom
        });

    // define the Node template
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        // define the node's outer shape, which will surround the TextBlock
        $(go.Shape, "RoundedRectangle",
          {
            parameter1: 20,  // the corner has a large radius
            fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
            stroke: null,
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
            cursor: "pointer"
          }),
        $(go.TextBlock,
          {
            font: "bold 11pt helvetica, bold arial, sans-serif",
            editable: true
          },
          new go.Binding("text").makeTwoWay())
      );

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          curve: go.Link.Bezier, adjusting: go.Link.Stretch,
          reshapable: true, relinkableFrom: true, relinkableTo: true,
          toShortLength: 3
        },
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

    load();

    createGraphAuto();
}


function createGraphAuto () {
    //document.getElementById('mySavedModel').innerHTML = "";
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
                text: Math.floor((Math.random() * 10) + 1)
            };
            //linkDataArray.push(linkdata);
            myDiagram.model.addLinkData(linkdata);

            demasNodos.splice(posicion, 1);
        }
    }


        
    //myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    //initAuto();
}