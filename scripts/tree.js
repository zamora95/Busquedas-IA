function initTree() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    treeDiagram =
        $(go.Diagram, "databox",  // must be the ID or reference to div
        {
            initialAutoScale: go.Diagram.UniformToFill,
            layout: $(go.TreeLayout,
                { comparer: go.LayoutVertex.smartComparer }) // have the comparer sort by numbers as well as letters
                // other properties are set by the layout function, defined below
        });
    // define the Node template
    treeDiagram.nodeTemplate =
        $(go.Node, "Spot",
            { locationSpot: go.Spot.Center },
            new go.Binding("text", "text"),  // for sorting
            $(go.Shape, "Circle",
                { fill: "lightblue",  // the initial value, but data binding may provide different value
                stroke: null,
                desiredSize: new go.Size(30, 30) }),
            $(go.TextBlock, 
            {
                font: "bold 11pt helvetica, bold arial, sans-serif",
                margin: 3
            },
            new go.Binding("text", "text"))
        );
    // define the Link template
    treeDiagram.linkTemplate =
        $(go.Link,
            { routing: go.Link.Orthogonal,
                selectable: false },
            $(go.Shape,
                { strokeWidth: 3, stroke: "#333" }));
    
    var lay = treeDiagram.layout;
    var angle = "90";
    angle = parseFloat(angle, 10);
    lay.angle = angle;

    //loadTree();
}
  
// Update the layout from the controls, and then perform the layout again
function layout() {
    treeDiagram.startTransaction("change Layout");
    var lay = treeDiagram.layout;

    var angle = "90";
    angle = parseFloat(angle, 10);
    lay.angle = angle;
    
    treeDiagram.commitTransaction("change Layout");
}



function loadTree() {

    var arbolGenerado = "{ \"class\": \"go.TreeModel\"," +
  "\"nodeDataArray\": [ " +
"{\"key\":5, \"text\":\"A\"}," +
"{\"key\":15, \"text\":\"B\", \"parent\":5}," +
"{\"key\":4, \"text\":\"C\", \"parent\":5}," +
"{\"key\":7, \"text\":\"D\", \"parent\":5}," +
"{\"key\":0, \"text\":\"E\", \"parent\":15}," +
"{\"key\":17, \"text\":\"F\", \"parent\":4}," +
"{\"key\":13, \"text\":\"G\", \"parent\":4}," +
"{\"key\":2, \"text\":\"H\", \"parent\":7}," +
"{\"key\":14, \"text\":\"I\", \"parent\":7}," +
"{\"key\":3, \"text\":\"J\", \"parent\":0}," +
"{\"key\":1, \"text\":\"K\", \"parent\":0}," +
"{\"key\":12, \"text\":\"L\", \"parent\":0}," +
"{\"key\":10, \"text\":\"M\", \"parent\":17}," +
"{\"key\":18, \"text\":\"N\", \"parent\":13}," +
"{\"key\":6, \"text\":\"O\", \"parent\":2}," +
"{\"key\":8, \"text\":\"P\", \"parent\":2}," +
"{\"key\":19, \"text\":\"Q\", \"parent\":2}," +
"{\"key\":9, \"text\":\"R\", \"parent\":14}," +
"{\"key\":16, \"text\":\"S\", \"parent\":14}," +
"{\"key\":11, \"text\":\"T\", \"parent\":3}" +
" ]}";

    treeDiagram.model = go.Model.fromJson(arbolGenerado);
}


var arcosSolucionTemp;

function getArcoTemp(to) {
    var arcoSeleccionado;
    for (var i = 0; i < arcosSolucionTemp.length; i++) {
        if (arcosSolucionTemp[i].to == to) {
            arcoSeleccionado = arcosSolucionTemp[i];
            arcosSolucionTemp.splice(i, 1);
            return arcoSeleccionado;
        }
    }
}

function buildJSONTree() {
    var parent;
    var JSONString = "{ \"class\": \"go.TreeModel\",\"nodeDataArray\": [ ";
    var nodeJSON;
    arcosSolucionTemp = arcosSolucion.slice();

    for (var i = 0; i < nodosSolucion.length; i++) {
        if (i == 0) {
            nodeJSON = "{\"key\":" + nodosSolucion[i].identifier + ", \"text\":\"" + nodosSolucion[i].text + "\"},";
            JSONString += nodeJSON;
            continue;
        }

        var arcoSeleccionado = getArcoTemp(nodosSolucion[i].identifier);
        parent = arcoSeleccionado.from;
        nodeJSON = "{\"key\":" + nodosSolucion[i].identifier + ", \"text\":\"" + nodosSolucion[i].text + "\", \"parent\":" + parent + "}";

        if (i < nodosSolucion.length-1) {
            nodeJSON += ",";
        }
        JSONString += nodeJSON;
    }

    JSONString += " ]}";
    console.log(JSONString);
    treeDiagram.model = go.Model.fromJson(JSONString);
}

//"{\"key\":15, \"text\":\"B\", \"parent\":5},"