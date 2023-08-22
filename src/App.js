import React, {useEffect, useState} from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu
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
 



const query = `MATCH (m:Movie {title: $title}) RETURN m`
const params = { title: 'The Matrix' }

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
  if(first){
    console.log("in first")
    console.log(first.get("m").properties.title)
    console.log(first)
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



  </div>
)
}

export default App
