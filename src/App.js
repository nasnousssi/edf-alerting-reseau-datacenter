import React, {useEffect, useState} from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu,
  Table,
  Label
} from 'semantic-ui-react'
import { useReadCypher } from 'use-neo4j'


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
    result = records.map((element) => 

      <Table.Row>
      <Table.Cell>{element.get("e.component")}</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
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



return (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
          Project Name
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
    <Container>
 <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Header</Table.HeaderCell>
        <Table.HeaderCell>Header</Table.HeaderCell>
        <Table.HeaderCell>Header</Table.HeaderCell>
        <Table.HeaderCell>Header</Table.HeaderCell>
        <Table.HeaderCell>Header</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
{result}
   


    </Table.Body>
    </Table>
    </Container>

  </div>
)
}

export default App
