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
import { SigmaContainer, useRegisterEvents, useSigma, useLoadGraph, ControlsContainer} from "@react-sigma/core";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";


import {Sigma, RandomizeNodePositions, RelativeSize, NodeShapes, EdgeShapes, ForceAtlas2} from 'react-sigma';


import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';



const App = () => {


const getDateFrom = () => {
// Get the current date and time
const currentDate = new Date();

// Subtract 15 minutes (in milliseconds) from the current date
const fifteenMinutesAgo = new Date(currentDate.getTime() - 15 * 60 * 1000);

// Extract the year, month, and day from the 15 minutes ago date
const year = fifteenMinutesAgo.getFullYear();
const month = fifteenMinutesAgo.getMonth() + 1; // Month is zero-based
const day = fifteenMinutesAgo.getDate();

// Create a new date with only the year, month, and day at midnight
const dateOnly = new Date(year, month - 1, day, 0, 0, 0, 0); // Month is zero-based

// Get the timestamp representing the date
return dateOnly.getTime();
}


const currentDate = new Date();

const currentHour = currentDate.getHours();
const currentMinutes = currentDate.getMinutes();




  const [fromDate, setFromDate] = useState(new Date(currentDate.getTime() - 15 * 60 * 1000));
  const [toDate, setToDate] = useState(currentDate);


  const [fromHour, setFromHour] = useState(new Date(currentDate.getTime() - 15 * 60 * 1000).getHours().toString());
  const [fromMinutes, setFromMinutes] = useState(new Date(currentDate.getTime() - 15 * 60 * 1000).getMinutes().toString());

  const [toHour, setToHour] = useState(currentHour.toString());
  const [toMinutes, setToMinutes] = useState(currentMinutes.toString());


  const [yearFrom, setYearFrom] = useState();
  const [monthFrom, setMonthFrom] = useState();
  const [dayFrom, setDayFrom] = useState();

  
  const [yearTo, setYearTo] = useState();
  const [monthTo, setMonthTo] = useState();
  const [dayTo, setDayTo] = useState();


  const [allRecords, setAllRecords] = useState([]);

 const [records, setRecords] = useState([]);
 const [services, setServices] = useState([]);
 const [components, setComponents] = useState([]);
 //const [year , setYear] = useState(["2023", "2022"]);
 const [filterServices, setFilterServices] = useState([]);
 const [filterComponent, setFilterComponent] = useState([]);
 const [intervalQyery, setIntervalQuery] = useState(10000);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPage, setTotalPage] = useState(records.length);
 const [allNodes, setAllNodes] = useState([]); 
 const refContainer = useRef(null);
 const graphRef = React.useRef(null)
 const [graphData, setGraphData] = useState({
  nodes: allNodes,
  edges: [],
});


const numElementPerPage = 100000


function getAlerts() {
  updateMovie().then(res => {
    if (res) {
      setAllRecords(res.records)
      
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

function orderByMetric(elements) {
  // Use the sort method with a custom comparator function
  return elements.sort((elementA, elementB) => {
    const metricA = calculateMetric(elementA);
    const metricB = calculateMetric(elementB);
    
    // Sort in descending order (highest to lowest)
    return metricB - metricA;
  });
}

function calculateMetric(element) {
  const pls = +element.get("pls");
  const good = +element.get("good");
  
  // Calculate the metric
  return (pls * 100) / (pls + good);
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




/* filtre date */


useEffect(()=> {

  console.log("================================ called when filter changed")
  getAlerts()

}, [yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, fromHour, fromMinutes, toHour, toMinutes]);



// React.useEffect(() => {
//   const filteredData = {
//     nodes: allNodes.filter(node => filterComponent.includes(node.id) || filterServices.includes(node.id)),
//     edges: [], // You can update edges as needed
//   };
//   setGraphData(filteredData);
// }, [allNodes, filterComponent, filterServices]);





function calculateNodePositionWithOffset(totalNodes, nodeIndex, centerX, centerY, radius, offsetDegrees) {
  const angleStep = (2 * Math.PI) / totalNodes;
  const angle = (nodeIndex * angleStep) + (offsetDegrees * (Math.PI / 180)); // Convert degrees to radians
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return { x, y };
}

const Fa2: React.FC = () => {
  const { start, kill, isRunning } = useWorkerLayoutForceAtlas2({ settings: { slowDown: 10 } });

  useEffect(() => {
    // start FA2
    start();
    return () => {
      // Kill FA2 on unmount
      kill();
    };
  }, [start, kill]);

  return null;
};

const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {


    var allServiceInGraph = []

    // Create the graph
    const graph = new MultiDirectedGraph();
   // graph.addNode("Alerte", { x: 0, y: 0, label: "Alerte", size: 10 }); 

    graph.addNode("Alerte", { x: 0, y: 0, label: "Alerte", size: 30 });
    records.forEach((element, index) => {

      if (element){
       if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){


      var item = element.get("e.device")

     var coords =  calculateNodePositionWithOffset(records.length, index, 0, 0, 20, 0)

      graph.addNode(item, { x: coords.x, y: coords.y, label: item, size: 10, color: "#FA4F40"});


      var s = element.get("services")

      graph.addEdgeWithKey("Alerte_" + item, "Alerte", item, { label: "ALERT"+index, size: element.get("pls")*30/(+element.get("pls") + +element.get("good")) } );

      s.forEach((el, ind) => {

    // console.log(el)
    // graph.addNode(el, { x: index+ind + 1, y: index + ind , label: el, size: 10 });
    // graph.addEdgeWithKey("rel_"+ item+ "_" + el, item, el, { label: "HAS" });

    // graph.addEdgeWithKey("rel_alerte_" + el, "Alerte", el, { label: "Alerte" });
   
    if(!allServiceInGraph.includes(el)){
    var corrschild =  calculateNodePositionWithOffset(s.length, ind, coords.x, coords.y, 10, 360)
      graph.addNode(el, { x: corrschild.x, y: corrschild.y, label: el, size: 10 });
      graph.addEdgeWithKey(item+ "_" + el, item, el, { label: "REL_2" });

    }
    allServiceInGraph.push(el)
    // myGraph.nodes.push({id: el, label: el, color: '#FF0' ,size: 3})
    // myGraph.edges.push({id:item+ "_" + el,  source: item, target: el})
    // myGraph.edges.push({id: "Alerte_" + el,  source: "Alerte", target: el})
  })

    } // end if 
  }
    })

    // graph.addNode("A", { x: 0, y: 0, label: "Node A", size: 10 });
    // graph.addNode("B", { x: 1, y: 1, label: "Node B", size: 10 });
    // graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });
    //
    loadGraph(graph);
  }, [loadGraph, allRecords,  records, filterComponent, filterServices]);

  return null;
};



function removeDuplicates(array) {
  const uniqueMap = new Map();
  return array.filter(obj => {
    const id = obj.id;
    if (!uniqueMap.has(id)) {
      uniqueMap.set(id, true);
      return true;
    }
    return false;
  });
}

React.useEffect(() => {

  const filteredData = {
    nodes: [],
    edges: [], // You can update edges as needed
  };


  var nodesWithDuplicate = []

  nodesWithDuplicate.push({id: "Alerte", label: "Alerte"})

  
  records.forEach((element, index) => {
 
    // if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){
    var item = element.get("e.device")
    nodesWithDuplicate.push({id: item, label: item, color: '#FF0', size: 10 })


    element.get("services").forEach((el, ind) => {
  
      nodesWithDuplicate.push({id: el, label: el, color: '#FF0' ,size: 10})
      filteredData.edges.push({id:item+ "_" + el+ ind,  source: item, target: el})
      filteredData.edges.push({id: "Alerte_" + el,  source: "Alerte", target: el})
    })
  
  // }
  })

filteredData.nodes = [ ...removeDuplicates(nodesWithDuplicate)]

console.log("wwawwawawaaaaaaaa")
console.log(filteredData.nodes )
  setGraphData(filteredData);

}, [allRecords,  records, filterComponent, filterServices]);


React.useEffect(() => {


  var r = []
    allRecords.forEach((element) => {
  
    if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){

        r.push(element)
    }

  })

    setCurrentPage(1)
    setRecords(paginateData(r, 1, numElementPerPage));
 
  
  setTotalPage(Math.ceil(r.length/numElementPerPage))

}, [allRecords, filterComponent, filterServices]);


 const [ updateMovie, { loadingT, firstT } ] = useLazyReadCypher(
  `Match (c:CRITICTE)
  where c.level = 'Alerte'
  OPTIONAL MATCH  (c)-[r:HAS]->(s:SERVICE)<- [f:IN_FRONT_OF]-(e:EQUIPEMENT)
  where r.date is not null and r.indicateur ='Etat SSA' and  datetime(r.date)  >  datetime({year: ${yearFrom}, month: ${monthFrom}, day: ${dayFrom}, hour: ${fromHour}, minute: ${fromMinutes}, second: 0, millisecond: 0}) and datetime(r.date)  <  datetime({year: ${yearTo}, month: ${monthTo}, day: ${dayTo}, hour: ${toHour}, minute: ${toMinutes}, second: 0, millisecond: 0})
  WITH count(distinct f) as pls, collect(distinct s.service) as services, e
  OPTIONAL MATCH (e)-[f2:IN_FRONT_OF]->(s2:SERVICE) 
  WITH pls, services, e , count(distinct s2) as allService
  WITH pls, services, e , (allService - pls) as good
  return pls, e.device, e.component, services, good`
)
function paginateData(data, pageNumber, itemsPerPage) {
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return orderByMetric(data);
}









const handleIntervalChange = (event, {value}) => {
  const newInterval = parseInt(value, 10);
  setIntervalQuery(newInterval);
};

const handleServiceFilterChange = (event, {value}) => {

  setFilterServices(value)
};

const handlePageChange = (event, value) => {

  setCurrentPage(value)


  setRecords(paginateData(allRecords, value.activePage, numElementPerPage));

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


const getNumPages = () =>{
  if((filterServices.length === 0 && filterComponent.length === 0)){
    console.log(allRecords.length/numElementPerPage)
    return Math.ceil(allRecords.length/numElementPerPage)
  } else {
    console.log(records.length/numElementPerPage)
    return 
  }
}


const onFromDate = (event, data) =>{ 
  
  const date = new Date(Date.parse(data.value));
  const year = date.getFullYear();
  const month = date.getMonth() + 1; 
  const day = date.getDate();

  setYearFrom(year)
  setMonthFrom(month)
  setDayFrom(day)

  setFromDate(data.value)

};
const onToDate = (event, data) => {
  
  const date = new Date(Date.parse(data.value));
  const year = date.getFullYear();
  const month = date.getMonth() + 1; 
  const day = date.getDate();


  setYearTo(year);
  setMonthTo(month);
  setDayTo(day)
  setToDate(data.value)
};

const onFromHour = (event, data) => setFromHour(data.value);
const onFromMinute = (event, data) => setFromMinutes(data.value);

const onToHour = (event, data) => setToHour(data.value);
const onToMinute = (event, data) => setToMinutes(data.value);




var result = <div></div>


  //console.log(first)
  if(records){
    //console.log(first.get("pls"))
   
    
   
   console.log("records")
   console.log(records) 



    result = records.map((element) => {


      if((filterServices.length === 0 && filterComponent.length === 0) || (filterServices.length > 0 && filterServices.some(item => element.get("services").includes(item) ) ) ||  (filterComponent.length > 0 && filterComponent.some(item => element.get("e.device") === item ) ) ){

     return ( <Table.Row>
      <Table.Cell textAlign='center'><Label key={element.get("e.device")} onClick={addComponentToFilter}>{element.get("e.device")}</Label></Table.Cell>
        <Table.Cell textAlign='center'>{element.get("e.component")}</Table.Cell>
        <Table.Cell textAlign='center'>{element.get("services").map(item =>  (<Label key={item} onClick={addTagToFilter}>{item}</Label>))}</Table.Cell>
        <Table.Cell textAlign='center'>
          {+element.get("pls")*100/(+element.get("pls") + +element.get("good"))}%</Table.Cell>
        <Table.Cell textAlign='center'>{+element.get("pls") + +element.get("good")}</Table.Cell>
      </Table.Row>
     )

      }
    }
    );
  }
  


  const hours = [
    { key: '0', value: '0', text: '0' },
    { key: '1', value: '1', text: '1' },
    { key: '2', value: '2', text: '2' },
    { key: '3', value: '3', text: '3' },
    { key: '4', value: '4', text: '4' },
    { key: '5', value: '5', text: '5' },
    { key: '6', value: '6', text: '6' },
    { key: '7', value: '7', text: '7' },
    { key: '8', value: '8', text: '8' },
    { key: '9', value: '9', text: '9' },
    { key: '10', value: '10', text: '10' },
    { key: '11', value: '11', text: '11' },
    { key: '12', value: '12', text: '12' },
    { key: '13', value: '13', text: '13' },
    { key: '14', value: '14', text: '14' },
    { key: '15', value: '15', text: '15' },
    { key: '16', value: '16', text: '16' },
    { key: '17', value: '17', text: '17' },
    { key: '18', value: '18', text: '18' },
    { key: '19', value: '19', text: '19' },
    { key: '20', value: '20', text: '20' },
    { key: '21', value: '21', text: '21' },
    { key: '22', value: '22', text: '22' },
    { key: '23', value: '23', text: '23' }
  ]


const minutes = [];

for (let i = 0; i <= 59; i++) {
  const minute = {
    key: i.toString(),
    value: i.toString(),
    text: i.toString(),
  };
  minutes.push(minute);
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
    <Menu.Item as='a' header>
          POC Neo4j 
        </Menu.Item>
      <Container>

        

        <Dropdown
        defaultValue="10000"
        search 
        item
        selection
        options={countryOptions}
        onChange={handleIntervalChange}
  />

          <Dropdown 
          placeholder='Applications'  
          multiple 
          selection 
          item
          options={services}
          onChange={handleServiceFilterChange}
          value={filterServices}
           />
           

          <Dropdown 
          placeholder='Composant'  
          multiple 
          selection 
          item
          options={components}
          onChange={handleComponentFilterChange}
          value={filterComponent}
           />



      </Container>

      <Menu.Menu position='right'>
      {/* <Menu.Item
            name='From'
          >
            From
          </Menu.Item> */}



          <Menu.Item>
          <SemanticDatepicker   value={fromDate} inverted locale='fr-FR' onChange={onFromDate}  />
          </Menu.Item>

          
         <Dropdown 
          placeholder='Hour'   
          selection 
          item
          compact
          options={hours}
          onChange={onFromHour}
          value={fromHour}
           />
          
          

        
         <Dropdown 
          placeholder='minutes'   
          selection 
          item
          compact
          options={minutes}
          onChange={onFromMinute}
          value={fromMinutes}
           />
       




          <Menu.Item
            name='-'
          >
            -
          </Menu.Item>

          <Menu.Item>
          <SemanticDatepicker  value={toDate} inverted locale='fr-FR' onChange={onToDate}  />
          </Menu.Item>

      
         <Dropdown 
          placeholder='Hour'   
         
          item
          compact
          options={hours}
          onChange={onToHour}
          value={toHour}
          defaultValue={toHour}
           />
       
          

          
         <Dropdown 
          placeholder='minutes'   
           
          item
          compact
          options={minutes}
          onChange={onToMinute}
          value={toMinutes}
          defaultValue={toMinutes}
           />
          



        </Menu.Menu>
    
    </Menu>


 











    <Grid celled padded style={{height: '100vh'}}>
    <Grid.Row style={{height: '100vh'}}> 
      <Grid.Column width={8} style={{height: '100vh'}}>
      <Segment basic padded='very' style={{ height: '100%', overflowY: 'auto' }}>
 <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell textAlign='center'>Composant reseau</Table.HeaderCell>
        <Table.HeaderCell textAlign='center'>type</Table.HeaderCell>
        <Table.HeaderCell textAlign='center'>Application en alerte</Table.HeaderCell>
        <Table.HeaderCell textAlign='center'>Etat du composant reseau </Table.HeaderCell>
        <Table.HeaderCell textAlign='center'>nombre d'application total</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
{result}
   


    </Table.Body>
    </Table>


   
    </Segment>
    {/* <Segment basic textAlign='center'> <Pagination activePage={currentPage}  defaultActivePage={1} totalPages={totalPage} onPageChange={handlePageChange}/></Segment> */}
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
      style={{ width: '90%', height: '100%' }}
      settings={{defaultEdgeType: "arrow" }}
    >
      <MyGraph />
     
       {/* // <Fa2 /> */}
     
    </SigmaContainer>

      </div>

      </Grid.Column >
    </Grid.Row>


  </Grid>






  </div>
)
}

export default App
