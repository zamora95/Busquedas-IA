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
            $(go.Shape, "Ellipse",
                { fill: "lightblue",  // the initial value, but data binding may provide different value
                stroke: null,
                desiredSize: new go.Size(30, 30) }),
            $(go.TextBlock,
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

    loadTree();
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
"{\"key\":5, \"text\":\"5\"}," +
"{\"key\":15, \"text\":\"15\", \"parent\":5}," +
"{\"key\":4, \"text\":\"4\", \"parent\":5}," +
"{\"key\":7, \"text\":\"7\", \"parent\":5}," +
"{\"key\":0, \"text\":\"0\", \"parent\":15}," +
"{\"key\":17, \"text\":\"17\", \"parent\":4}," +
"{\"key\":13, \"text\":\"13\", \"parent\":4}," +
"{\"key\":2, \"text\":\"2\", \"parent\":7}," +
"{\"key\":14, \"text\":\"14\", \"parent\":7}," +
"{\"key\":3, \"text\":\"3\", \"parent\":0}," +
"{\"key\":1, \"text\":\"1\", \"parent\":0}," +
"{\"key\":12, \"text\":\"12\", \"parent\":0}," +
"{\"key\":10, \"text\":\"10\", \"parent\":17}," +
"{\"key\":18, \"text\":\"18\", \"parent\":13}," +
"{\"key\":6, \"text\":\"6\", \"parent\":2}," +
"{\"key\":8, \"text\":\"8\", \"parent\":2}," +
"{\"key\":19, \"text\":\"19\", \"parent\":2}," +
"{\"key\":9, \"text\":\"9\", \"parent\":14}," +
"{\"key\":16, \"text\":\"16\", \"parent\":14}," +
"{\"key\":11, \"text\":\"11\", \"parent\":3}" +
" ]}";

    treeDiagram.model = go.Model.fromJson(arbolGenerado);
}