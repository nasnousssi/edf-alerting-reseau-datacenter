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
import { useReadCypher } from 'use-neo4j'
import { Graph } from "react-d3-graph";

import config from "./config";


import  Logo  from './edf.png';


const App = () => {
 const [driver, setDriver] = useState();
 const [intervalQyery, setIntervalQuery] = useState();


function getAlerts()  {



console.log("mvie")
console.log(first)
}


 useEffect(()=> {

  setIntervalQuery(setInterval(() => console.log("totot"), 10000));


  return () => {

    if(intervalQyery){
      clearInterval(intervalQyery)
    }
  
  }

}, []);
 
setInterval(() => console.log("totot"), 10000)

var result = <div></div>

const query = `Match (c:CRITICTE)
where c.level = 'Alerte'
OPTIONAL MATCH  (c)-[r:HAS]->(s:SERVICE)<- [f:IN_FRONT_OF]-(e:EQUIPEMENT) 
WITH count(f) as pls, collect(s.service) as services, e
OPTIONAL MATCH (e)-[f2:IN_FRONT_OF]->(s2:SERVICE)<- [r2:HAS] -(c2:CRITICTE)
WHERE c2 <> 'Alerte'
WITH pls, services, e , count(r2) as good
return pls, e.device, e.component, services, good`
const params = {  }

const {
  loading,
  error,
  records,
  first 
} = useReadCypher(query, params)

if ( error ) { console.log("éerrorrrrré")}



console.log("yaaaa")
console.log(loading)
console.log(first)
 if ( loading ) return (<div>Loading...</div>)
 if(!loading){
  //const movies = records.map(row => row.get('movie'))

  console.log("query finished ")
  console.log("so first is ")
  //console.log(first)
  if(records){
    console.log("in first")
    //console.log(first.get("pls"))
    
    records.forEach(element => element.get("services").forEach(item => console.log(item) ))
    result = records.map((element) => 

      <Table.Row>
      <Table.Cell>{element.get("e.device")}</Table.Cell>
        <Table.Cell>{element.get("e.component")}</Table.Cell>
        <Table.Cell>{element.get("services").map(item =>  (<Label key={item}>{item}</Label>))}</Table.Cell>
        <Table.Cell>
          {+element.get("pls")*100/(+element.get("pls") + +element.get("good"))}%</Table.Cell>
        <Table.Cell>{+element.get("pls") + +element.get("good")}</Table.Cell>
      </Table.Row>


    );
    console.log(records)
    console.log("finished first")
  }
  
  if(records && records.size > 0){
    console.log("ouiii")
    console.log(records.map(item => console.log(item)))
  }

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

return (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src={Logo} style={{ marginRight: '1.5em' }} />
          POC Neo4j 
        </Menu.Item>
        <Menu.Item as='a'>Home</Menu.Item>

        <Dropdown item simple text='Dropdown'>
          <Dropdown.Menu>
            <Dropdown.Item>List Item</Dropdown.Item>
            <Dropdown.Item>List Item</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Header Item</Dropdown.Header>
            <Dropdown.Item>
              <i className='dropdown icon' />
              <span className='text'>Submenu</span>
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>List Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>




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
