import React, {useEffect, useState, FC, useRef} from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu,
  Table,
  Segment,
  Label,
  Grid,
  Pagination
} from 'semantic-ui-react'
import { useReadCypher, useLazyReadCypher } from 'use-neo4j'
// import { Graph } from "react-d3-graph";

import config, { height, width } from "./config";

import "@react-sigma/core/lib/react-sigma.min.css";
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer, useRegisterEvents, useSigma, useLoadGraph} from "@react-sigma/core";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";



import {Sigma, RandomizeNodePositions, RelativeSize, NodeShapes, EdgeShapes, ForceAtlas2} from 'react-sigma';




const App = () => {
 const [records, setRecords] = useState([]);
 const [services, setServices] = useState([]);
 const [components, setComponents] = useState([]);
 const [filterServices, setFilterServices] = useState([]);
 const [filterComponent, setFilterComponent] = useState([]);
 const [intervalQyery, setIntervalQuery] = useState(10000);
 const [currentPage, setCurrentPage] = useState(1);
 const [allNodes, setAllNodes] = useState([]); 
 const refContainer = useRef(null);
 const graphRef = React.useRef(null)
 const [graphData, setGraphData] = useState({
  nodes: allNodes,
  edges: [],
});


const numElementPerPage = 5



// React.useEffect(() => {
//   const filteredData = {
//     nodes: allNodes.filter(node => filterComponent.includes(node.id) || filterServices.includes(node.id)),
//     edges: [], // You can update edges as needed
//   };
//   setGraphData(filteredData);
// }, [allNodes, filterComponent, filterServices]);


const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {



    // Create the graph
    const graph = new MultiDirectedGraph();
    
    records.forEach((element, index) => {

       if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){


      var item = element.get("e.device")
      graph.addNode(item, { x: 10+index, y: 10+index, label: item, size: 10 });


      element.get("services").forEach((el, ind) => {
    // console.log(el)
    // graph.addNode(el, { x: index+ind + 1, y: index + ind , label: el, size: 10 });
    // graph.addEdgeWithKey("rel_"+ item+ "_" + el, item, el, { label: "HAS" });

    // graph.addEdgeWithKey("rel_alerte_" + el, "Alerte", el, { label: "Alerte" });
    
      graph.addNode(el, { x: ind+index*100, y: ind+index*100, label: el, size: 10 });
      graph.addEdgeWithKey(item+ "_" + el, item, el, { label: "REL_2" });
    // myGraph.nodes.push({id: el, label: el, color: '#FF0' ,size: 3})
    // myGraph.edges.push({id:item+ "_" + el,  source: item, target: el})
    // myGraph.edges.push({id: "Alerte_" + el,  source: "Alerte", target: el})
  })

    }
    })

    // graph.addNode("A", { x: 0, y: 0, label: "Node A", size: 10 });
    // graph.addNode("B", { x: 1, y: 1, label: "Node B", size: 10 });
    // graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });
    //
    loadGraph(graph);
  }, [loadGraph, filterComponent, filterServices]);

  return null;
};



React.useEffect(() => {

  const filteredData = {
    nodes: [],
    edges: [], // You can update edges as needed
  };


  filteredData.nodes.push({id: "Alerte", label: "Alerte"})
  records.forEach((element, index) => {
 
    // if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){
    var item = element.get("e.device")
  // graph.addNode(item, { x: index, y: index, label: item, size: 10 });
    filteredData.nodes.push({id: item, label: item, color: '#FF0', size: 10 })
  

    //setAllNodes(prevArray => [...prevArray, {id: item, label: item, color: '#FF0', size: 3 }])

    element.get("services").forEach((el, ind) => {
  
      
     // setAllNodes(prevArray => [...prevArray, {id: el, label: el, color: '#FF0' ,size: 10}])

      filteredData.nodes.push({id: el, label: el, color: '#FF0' ,size: 10})
      filteredData.edges.push({id:item+ "_" + el,  source: item, target: el})
      filteredData.edges.push({id: "Alerte_" + el,  source: "Alerte", target: el})
    })
  
  // }
  })

  setGraphData(filteredData);



}, [ records, filterComponent, filterServices]);

 const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState(null);




  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      mouseup: (e) => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      mousedown: (e) => {
        // Disable the autoscale at the first down interaction
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      mousemove: (e) => {
        if (draggedNode) {
          // Get new position of node
          const pos = sigma.viewportToGraph(e);
          sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
          sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

          // Prevent sigma to move camera:
          e.preventSigmaDefault();
          e.original.preventDefault();
          e.original.stopPropagation();
        }
      },
      touchup: (e) => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      touchdown: (e) => {
        // Disable the autoscale at the first down interaction
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      touchmove: (e) => {
        if (draggedNode) {
          // Get new position of node
          const pos = sigma.viewportToGraph(e);
          sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
          sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

          // Prevent sigma to move camera:
          e.preventSigmaDefault();
          e.original.preventDefault();
          e.original.stopPropagation();
        }
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};


 const [ updateMovie, { loadingT, firstT } ] = useLazyReadCypher(
  `Match (c:CRITICTE)
  where c.level = 'Alerte'
  OPTIONAL MATCH  (c)-[r:HAS]->(s:SERVICE)<- [f:IN_FRONT_OF]-(e:EQUIPEMENT) 
  WITH count(f) as pls, collect(s.service) as services, e
  OPTIONAL MATCH (e)-[f2:IN_FRONT_OF]->(s2:SERVICE)<- [r2:HAS] -(c2:CRITICTE)
  WHERE c2 <> 'Alerte'
  WITH pls, services, e , count(r2) as good
  return pls, e.device, e.component, services, good`
)


function getAlerts() {
  updateMovie().then(res => {
    if (res) {
      setRecords(res.records);

      const servicesSet = new Set();
      const componentsSet = new Set();

      res.records.forEach(item => {
        const services = item.get("services");
        if (Array.isArray(services)) {
          services.forEach(service => servicesSet.add(service));
        }

        componentsSet.add(item.get("e.device")); // Corrected line
      });

      const distinctServices = Array.from(servicesSet).map(service => ({
        key: service,
        text: service,
        value: service,
      }));

      setServices(distinctServices);

      const distinctComponents = Array.from(componentsSet).map(component => ({
        key: component,
        text: component,
        value: component,
      }));

      setComponents(distinctComponents);
    }
  });
}


 useEffect(()=> {
  getAlerts()
  var inter = setInterval(() => { getAlerts()}, intervalQyery)

   //setIntervalEvent(inter);   

  return () => {

    if(inter){
      clearInterval(inter)
    }
  
  }

}, [intervalQyery]);





const handleIntervalChange = (event, {value}) => {
  const newInterval = parseInt(value, 10);
  setIntervalQuery(newInterval);
};

const handleServiceFilterChange = (event, {value}) => {

  setFilterServices(value)
};

const handlePageChange = (event, {value}) => {

  setCurrentPage(value)
};

const handleComponentFilterChange = (event, {value}) => {

  setFilterComponent(value)
};
const addTagToFilter = (event, value) => {


  if (!filterServices.includes(value.children)) {
    setFilterServices([...filterServices, value.children]);
  }
};
const addComponentToFilter = (event, value) => {


  if (!filterComponent.includes(value.children)) {
    setFilterComponent([...filterComponent, value.children]);
  }
};

var result = <div></div>


  //console.log(first)
  if(records){
    //console.log(first.get("pls"))
   
    
   




    result = records.map((element) => {


      if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){

     return ( <Table.Row>
      <Table.Cell><Label key={element.get("e.device")} onClick={addComponentToFilter}>{element.get("e.device")}</Label></Table.Cell>
        <Table.Cell>{element.get("e.component")}</Table.Cell>
        <Table.Cell>{element.get("services").map(item =>  (<Label key={item} onClick={addTagToFilter}>{item}</Label>))}</Table.Cell>
        <Table.Cell>
          {+element.get("pls")*100/(+element.get("pls") + +element.get("good"))}%</Table.Cell>
        <Table.Cell>{+element.get("pls") + +element.get("good")}</Table.Cell>
      </Table.Row>
     )

      }
    }
    );
  }
  


  const LoadGraphWithByProp: FC = () => {


  // return {
  //   nodes: nodes,
  //   links: edges, 
  //   focusedNodeId: "suuuuuuuuuuuuuuu"
  // }

 
 // graph.addNode("A", { x: 0, y: 0, label: "Node A", size: 10 });
  //graph.addNode("B", { x: 1, y: 1, label: "Node B", size: 10 });
  //graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });

  return ;
} 




const countryOptions = [
  { key: '10', value: '10000', text: '10 Secondes' },
  { key: '20', value: '20000', text: '20 Secondes' },
  { key: '30', value: '30000', text: '30 Secondes' },
  { key: '60', value: '60000', text: '1 Minute' },
  { key: '120', value: '120000', text: '2 Minutes' },
  { key: '300', value: '300000', text: '5 Minutes' },
  { key: '600', value: '600000', text: '10 Minutes' },
]



// //const graph = new MultiDirectedGraph();
// var nodes = []
// var edges = []


// var myGraph = {
//   nodes : [],
//   edges : []
// }

// // graph.addNode("Alerte", { x: 10, y: 10, label: "Alete", size: 10 });
// nodes.push({id: "Alerte", label: "Alerte"})

// records.forEach((element, index) => {
 
//   // if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){
//   var item = element.get("e.device")
// // graph.addNode(item, { x: index, y: index, label: item, size: 10 });
//   myGraph.nodes.push({id: item, label: item, color: '#FF0', size: 3 })
//   element.get("services").forEach((el, ind) => {
//     // console.log(el)
//     // graph.addNode(el, { x: index+ind + 1, y: index + ind , label: el, size: 10 });
//     // graph.addEdgeWithKey("rel_"+ item+ "_" + el, item, el, { label: "HAS" });

//     // graph.addEdgeWithKey("rel_alerte_" + el, "Alerte", el, { label: "Alerte" });
//     myGraph.nodes.push({id: el, label: el, color: '#FF0' ,size: 3})
//     myGraph.edges.push({id:item+ "_" + el,  source: item, target: el})
//     myGraph.edges.push({id: "Alerte_" + el,  source: "Alerte", target: el})
//   })

// // }
// })


console.log(graphData)


//let myGraph =  {nodes, edges};
// let myGraph2 = {nodes:[{id:"n1", label:"Alice"}, {id:"n2", label:"Rabbit"}], edges:[{id:"e1",source:"n1",target:"n2",label:"SEES"}]};

//console.log(myGraph)
// console.log(myGraph2)

return (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          POC Neo4j 
        </Menu.Item>
        

        <Dropdown
        defaultValue="10000"
        search 
        selection
        options={countryOptions}
        onChange={handleIntervalChange}
  />

          <Dropdown 
          placeholder='Applications'  
          multiple 
          selection 
          options={services}
          onChange={handleServiceFilterChange}
          value={filterServices}
           />
           

          <Dropdown 
          placeholder='Composant'  
          multiple 
          selection 
          options={components}
          onChange={handleComponentFilterChange}
          value={filterComponent}
           />



      </Container>
    
    </Menu>


 











    <Grid celled padded style={{height: '100vh'}}>
    <Grid.Row style={{height: '100%'}}> 
      <Grid.Column width={8}>
      <Segment basic padded='very'>
 <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Composant reseau</Table.HeaderCell>
        <Table.HeaderCell>type</Table.HeaderCell>
        <Table.HeaderCell>Application en alerte</Table.HeaderCell>
        <Table.HeaderCell>Etat du composant reseau </Table.HeaderCell>
        <Table.HeaderCell>nombre d'application total</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
{result}
   


    </Table.Body>
    </Table>


   
    </Segment>
    <Segment basic textAlign='center'> <Pagination defaultActivePage={1} totalPages={records.length/numElementPerPage + 1} onPageChange={handlePageChange}/></Segment>
      </Grid.Column>
      <Grid.Column width={8}>

      <div ref={graphRef} style={{ width: '100%', height: '100%' }}>
   {/* { dim.width && <Graph id="my-graph" config={myConfig} data={data}  />} */}

  

  {/* { graphData.nodes.length >0 && (<Sigma ref={refContainer} style={{ width: '100%', height: '100%' }} graph={graphData} settings={{drawEdges: true, clone: false}}>
  <RelativeSize initialSize={15}/>
  <RandomizeNodePositions/>
</Sigma>) */}
{/* } */}


<SigmaContainer
      graph={MultiDirectedGraph}
      style={{ width: '100%', height: '100%' }}
      settings={{ renderEdgeLabels: true, defaultEdgeType: "arrow" }}
    >
      <MyGraph />
    </SigmaContainer>
      </div>

      </Grid.Column >
    </Grid.Row>


  </Grid>






  </div>
)
}

export default App
