import React, {useEffect, useState} from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu,
  Table,
  Segment,
  Label,
  Grid
} from 'semantic-ui-react'
import { useReadCypher, useLazyReadCypher } from 'use-neo4j'
import { Graph } from "react-d3-graph";

import config from "./config";




const App = () => {
 const [records, setRecords] = useState([]);
 const [services, setServices] = useState([]);
 const [components, setComponents] = useState([]);
 const [filterServices, setFilterServices] = useState([]);
 const [filterComponent, setFilterComponent] = useState([]);
 const [intervalQyery, setIntervalQuery] = useState(10000);
 const [dateQuery, setDateQuery] = useState(); 


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
  console.log(newInterval)
  setIntervalQuery(newInterval);
};

const handleServiceFilterChange = (event, {value}) => {

  setFilterServices(value)
};
const handleComponentFilterChange = (event, {value}) => {

  setFilterComponent(value)
};
const addTagToFilter = (event, value) => {


  console.log(value.children)
  if (!filterServices.includes(value.children)) {
    setFilterServices([...filterServices, value.children]);
  }
};
const addComponentToFilter = (event, value) => {


  console.log(value.children)
  if (!filterComponent.includes(value.children)) {
    setFilterComponent([...filterComponent, value.children]);
  }
};

var result = <div></div>


  //console.log(first)
  if(records){
    //console.log(first.get("pls"))
   
    


    result = records.map((element) => {

      console.log(filterComponent.length)
      console.log(filterComponent)
      console.log(filterServices.length === 0 && filterComponent === 0)

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
  


 


 const data = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [
    { source: "Harry", target: "Sally" },
    { source: "Harry", target: "Alice" },
  ],
};

const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 120,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "lightblue",
  },
};




const countryOptions = [
  { key: '10', value: '10000', text: '10 Secondes' },
  { key: '20', value: '20000', text: '20 Secondes' },
  { key: '30', value: '30000', text: '30 Secondes' },
  { key: '60', value: '60000', text: '1 Minute' },
  { key: '120', value: '120000', text: '2 Minutes' },
  { key: '300', value: '300000', text: '5 Minutes' },
  { key: '600', value: '600000', text: '10 Minutes' },
]



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


 











    <Grid>
    <Grid.Row>
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
      </Grid.Column>
      <Grid.Column width={8}>
      <Segment>
    <div id="graph-container" className="graph-container">
    <Graph id="graph" config={myConfig} data={data}  />
    </div>
    </Segment>
      </Grid.Column>
    </Grid.Row>


  </Grid>






  </div>
)
}

export default App
