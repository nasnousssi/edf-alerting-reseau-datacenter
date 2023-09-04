# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# local 

## database 
export NEO4J_PATH=/Users/anisbenbrahim/Documents/projet/edf/neo4j_data
docker run --publish=7474:7474 --publish=7687:7687 --volume=$NEO4J_PATH:/data neo4j:latest


## data

```
Match (c:CRITICTE)
where c.level = 'Alerte'
OPTIONAL MATCH(c)-[r:HAS]->(s:SERVICE)<- [f:IN_FRONT_OF]-(e:EQUIPEMENT)
WITH count(f) as pls, collect(s.service) as services, e
OPTIONAL MATCH (e)-[f2:IN_FRONT_OF]->(s2:SERVICE)<- [r2:HAS] -(c2:CRITICTE)
WHERE c2 <> 'Alerte'
WITH pls, services, e , count(r2) as good
return pls, e.device, e.component, services, good


create (n:CRITICTE { level:'Alerte'})
create (n2:CRITICTE { level:'OK'})
Create (s:SERVICE { service: 'GPS'})
create (n)-[:HAS]->(s)
create (e:EQUIPEMENT { component: 'slb', device:'DERREJNJND', type:'F5'})
CREATE (e)-[:IN_FRONT_OF]->(s)
create (e2:EQUIPEMENT { component: 'swtich', device:'tzeczknczekn', type:'F5'})
Create (s2:SERVICE { service: 'OLALA'})

CREATE (e2)-[:IN_FRONT_OF]->(s2)
CREATE (n)-[:HAS]->(s2)



create (e3:EQUIPEMENT { component: 'swtich', device:'tzeczknczedzdzedkn', type:'F5'})
Create (s3:SERVICE { service: 'OLALA3'})
CREATE (e3)-[:IN_FRONT_OF]->(s3)
CREATE (n2)-[:HAS]->(s3)



create (e4:EQUIPEMENT { component: 'swtich', device:'zedzedezd', type:'F5'})
Create (s4:SERVICE { service: 'dezzdzdzddzed'})
CREATE (e4)-[:IN_FRONT_OF]->(s4)
CREATE (n)-[:HAS]->(s4)


create (e5:EQUIPEMENT { component: 'swtich', device:'fzfzfzf', type:'F5'})
Create (s5:SERVICE { service: 'OLedzdzedALA'})
CREATE (e5)-[:IN_FRONT_OF]->(s5)
CREATE (n)-[:HAS]->(s5)

CREATE (e6:EQUIPEMENT { component: 'swtich', device:'fzfzfzf6', type:'F56'})
CREATE (s6:SERVICE { service: 'OLedzdzedALA6'})
CREATE (e6)-[:IN_FRONT_OF]->(s6)
CREATE (n)-[:HAS]->(s6)

CREATE (e7:EQUIPEMENT { component: 'swtich', device:'fzfzfzf7', type:'F57'})
CREATE (s7:SERVICE { service: 'OLedzdzedALA7'})
CREATE (e7)-[:IN_FRONT_OF]->(s7)
CREATE (n)-[:HAS]->(s7)

CREATE (e8:EQUIPEMENT { component: 'swtich', device:'fzfzfzf8', type:'F58'})
CREATE (s8:SERVICE { service: 'OLedzdzedALA8'})
CREATE (e8)-[:IN_FRONT_OF]->(s8)
CREATE (n)-[:HAS]->(s8)

CREATE (e9:EQUIPEMENT { component: 'swtich', device:'fzfzfzf9', type:'F59'})
CREATE (s9:SERVICE { service: 'OLedzdzedALA9'})
CREATE (e9)-[:IN_FRONT_OF]->(s9)
CREATE (n)-[:HAS]->(s9)

CREATE (e10:EQUIPEMENT { component: 'swtich', device:'fzfzfzf10', type:'F510'})
CREATE (s10:SERVICE { service: 'OLedzdzedALA10'})
CREATE (e10)-[:IN_FRONT_OF]->(s10)
CREATE (n)-[:HAS]->(s10)

CREATE (e11:EQUIPEMENT { component: 'swtich', device:'fzfzfzf11', type:'F511'})
CREATE (s11:SERVICE { service: 'OLedzdzedALA11'})
CREATE (e11)-[:IN_FRONT_OF]->(s11)
CREATE (n)-[:HAS]->(s11)

CREATE (e12:EQUIPEMENT { component: 'swtich', device:'fzfzfzf12', type:'F512'})
CREATE (s12:SERVICE { service: 'OLedzdzedALA12'})
CREATE (e12)-[:IN_FRONT_OF]->(s12)
CREATE (n)-[:HAS]->(s12)

CREATE (e13:EQUIPEMENT { component: 'swtich', device:'fzfzfzf13', type:'F513'})
CREATE (s13:SERVICE { service: 'OLedzdzedALA13'})
CREATE (e13)-[:IN_FRONT_OF]->(s13)
CREATE (n)-[:HAS]->(s13)

CREATE (e14:EQUIPEMENT { component: 'swtich', device:'fzfzfzf14', type:'F514'})
CREATE (s14:SERVICE { service: 'OLedzdzedALA14'})
CREATE (e14)-[:IN_FRONT_OF]->(s14)
CREATE (n)-[:HAS]->(s14)

CREATE (e15:EQUIPEMENT { component: 'swtich', device:'fzfzfzf15', type:'F515'})
CREATE (s15:SERVICE { service: 'OLedzdzedALA15'})
CREATE (e15)-[:IN_FRONT_OF]->(s15)
CREATE (n)-[:HAS]->(s15)

CREATE (e16:EQUIPEMENT { component: 'swtich', device:'fzfzfzf16', type:'F516'})
CREATE (s16:SERVICE { service: 'OLedzdzedALA16'})
CREATE (e16)-[:IN_FRONT_OF]->(s16)
CREATE (n)-[:HAS]->(s16)

CREATE (e17:EQUIPEMENT { component: 'swtich', device:'fzfzfzf17', type:'F517'})
CREATE (s17:SERVICE { service: 'OLedzdzedALA17'})
CREATE (e17)-[:IN_FRONT_OF]->(s17)
CREATE (n)-[:HAS]->(s17)

CREATE (e18:EQUIPEMENT { component: 'swtich', device:'fzfzfzf18', type:'F518'})
CREATE (s18:SERVICE { service: 'OLedzdzedALA18'})
CREATE (e18)-[:IN_FRONT_OF]->(s18)
CREATE (n)-[:HAS]->(s18)

CREATE (e19:EQUIPEMENT { component: 'swtich', device:'fzfzfzf19', type:'F519'})
CREATE (s19:SERVICE { service: 'OLedzdzedALA19'})
CREATE (e19)-[:IN_FRONT_OF]->(s19)
CREATE (n)-[:HAS]->(s19)

CREATE (e20:EQUIPEMENT { component: 'swtich', device:'fzfzfzf20', type:'F520'})
CREATE (s20:SERVICE { service: 'OLedzdzedALA20'})
CREATE (e20)-[:IN_FRONT_OF]->(s20)
CREATE (n)-[:HAS]->(s20)

CREATE (e21:EQUIPEMENT { component: 'swtich', device:'fzfzfzf21', type:'F521'})
CREATE (s21:SERVICE { service: 'OLedzdzedALA21'})
CREATE (e21)-[:IN_FRONT_OF]->(s21)
CREATE (n)-[:HAS]->(s21)

CREATE (e22:EQUIPEMENT { component: 'swtich', device:'fzfzfzf22', type:'F522'})
CREATE (s22:SERVICE { service: 'OLedzdzedALA22'})
CREATE (e22)-[:IN_FRONT_OF]->(s22)
CREATE (n)-[:HAS]->(s22)

CREATE (e23:EQUIPEMENT { component: 'swtich', device:'fzfzfzf23', type:'F523'})
CREATE (s23:SERVICE { service: 'OLedzdzedALA23'})
CREATE (e23)-[:IN_FRONT_OF]->(s23)
CREATE (n)-[:HAS]->(s23)

CREATE (e24:EQUIPEMENT { component: 'swtich', device:'fzfzfzf24', type:'F524'})
CREATE (s24:SERVICE { service: 'OLedzdzedALA24'})
CREATE (e24)-[:IN_FRONT_OF]->(s24)
CREATE (n)-[:HAS]->(s24)

CREATE (e25:EQUIPEMENT { component: 'swtich', device:'fzfzfzf25', type:'F525'})
CREATE (s25:SERVICE { service: 'OLedzdzedALA25'})
CREATE (e25)-[:IN_FRONT_OF]->(s25)
CREATE (n)-[:HAS]->(s25)
CREATE (e)-[:IN_FRONT_OF]->(s3)

``````