
# CoNDeT  

### _Contextual Networked Decision Tables_

#### 1 Requirements

Main objective of this project was creation of light JavaScript library without using any frameworks that would allow users to freely visualize and edit CoNDeT table. Library should allow to save current visualization state to JSON file and load JSON file from user device.

#### 2 Results

##### 2.1 Achieved Result
Library is fully functional with ways to improve. During development, we were able to complete all necesarry basic requirements. Visualized CoNDeT table have all of ellements visable and can be moved freely during visualization. When edit mode is active user has avalible large selection of edit options:
 1. Adding  rows and columns
 2. Removing rows and columns 
 3. Modifying cells and table properties
 4. Creating new connections
 5. Deleting a table

 Users are able to read saved state from JSON file and save it on their device in JSON format. 

##### 2.2 Possible future development

* Adding data and connection validation - without it whole responsibility is on user
* Adding history to allow users to go back to previous states 
* Adding keyboard navigation
* Improving UI to make it more accessible to users

#### 3 Installation and setup

1. Use `library/builder.py` to build - you can skip this step if you didn't make any changes in project
    ```
    cd library
    python3 builder.py [filename]
    ```
   Without passing a filename it defaults to CoNDeT.js
2. From `library/dist/` copy output file to your project and import it via script tag
    ```html
    <script src="./CoNDeT.js"></script>
    ```
3. Add styles to your HTML file if you want to customize CoNDeT table visualization. You can use example styles from `library/css`
    ```html  
    <link rel="stylesheet" href="./styles.css">
    ```
4. To init library user need to create container element and run below code:
    ```js
    const instance = window.CoNDeT(configurationObject);
    ```

#### 4 Usage

##### Configuration
User can initialize more than one instance of library. Configuration object takes:
* `selector` - css selector of container in which to display CoNDeT visualization. Defaults to `.condet-display`
* `entryMode` - starting mode. `display` or `edit`
* `icons` - icons object that contains two keys: `delete` and `add`. You can pass here your own symbol that will be used for displaying adding or deleting button. Library provide default values: `❌` and `➕`

#### Data
CoNDeT table can be store as an object that contains: 
* `id`
* `name`
* `class`
* `coordinates` - object with `x` and `y` keys
* `columns` - object that contains two lists of string values for `conditions` and `decisions`. Every value must be unique
* `rows` - array of objects which represents row. Every object contains:
    * `row_id`
    * `conditions` - list of tuples (2 element array). Every tuple contains condition id (position number) and cell value
    * `decisions` - list of tuples. Every tuple contains decision id and cell value
    * `connections` - list of table ids
    
To set state directly in code we can use `setState` method:
```js 
instance.setState(state);
```

We can also save state to file via `saveToFile` method and red from a file using `readFromFile` one

#### style customization
Every table contains set of class added conditionally based on state:
* `condet-table` - for adding common style for 
* `condet-class-<className>` - for styling table of given class (replace `<className>` with name of class you want to style)
* `condet-table-movable` - for styling table that can be moved in edit mode
* `condet-table-selected` - for styling table in hover state during selecting connection target

#### Display mode
Display mode provide ability to move ConDeT table freely on a window:
  
State before moving:  

![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/Display1.jpg?raw=true )

State after moving:  

![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/Displa2.jpg?raw=true )

As we can see tables moved in our window, but relative position didn't change

#### Edit mode
Edit mode provide:

*  Ability to change position of table
   
   State before changing moving table:
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/EditMode1.jpg?raw=true)

    State after moving table:
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode2.jpg?raw=true )

    We can see that relative position between tables changed

*   Ability to remove column:

    To remove column you need to click **X**  visible on top of chosen column
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode3rcolumn.jpg?raw=true )

    We can see that B1 column was deleted from Minor table

*  Ability to remove row

    To remove row you need click **X** visible on left side of chosen row

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode4rrow.jpg?raw=true )

    Second row in Minor table was removed

*  Ability to modify cell

    To modify a cell we need to double-click on target cell 

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode5modifycell1.jpg?raw=true )

    After double click cell change to input. To save our changes we need to press **ENTER**

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode6modiffcell2.jpg?raw=true )

    We can see new data inserted into our cell

*  Ability to modify table properties

    To modify table properties we need to double-click on table header

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode7modiffytableproperties.jpg?raw=true )

    To close edit mode and save our modifications we need to press **ENTER**

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode7modiffytableproperties2.jpg?raw=true )

    We can see modified table properties.

*  Ability to add new connection

    To add new connection we need to press **+** in right part of selected row. We can add more than one connection outgoing from row   

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode8addconnection.jpg?raw=true )

    After pressing **+** we need to select target table by pressing on it.
    
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode8addconnection2.jpg?raw=true )

    We can see that new connection appeared

*  Ability to delete Tables

    To delete our table we need to press **X** in top left corner of our table

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editMode9deleteTable.jpg?raw=true )

    State after deletion

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editMode9deleteTable2.jpg?raw=true )


*  Ability to add new Table

    To add a new table we need to double-click free space in our window. We can also call `addTable` method on instance object

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode10addTable.jpg?raw=true )

    We can see a prompt window that appeared. We will see three of them showing up with each of them asking us for table properties values.

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode10addTable2.jpg?raw=true )

    As we can see the new table appeared with data we passed 


*  Ability to add new columns

    To add a new column we need to press **+** at first row of table. First **+** allows us to add new _condition_ and second one to add new _decision_

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode11addcolumn.jpg?raw=true )

    We see that window show up that ask us for value we want our _condition_ or _decision_ to has
    
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode11addcolumn2.jpg?raw=true )

    We can see that new columns appeared

*  Ability to add new row

    To add new row we need to click **+** that we see in bottom left part of table

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode12addrow.jpg?raw=true )

    After clicking **+** sign we see new empty row that appeared

#### 5 Contributors

* Emil Sroka
    * Architecture
    * Project management
    * Created Example of library usage
    * Implemented mechanism that allowed moving the tables
    * Implemented cell modification
    * Implemented add and remove connection mechanism
    * Created connection component
    * Created SVG component
    * Created main object
* Hubet Miziołek
    * Implemented mechanism to save current state to file
    * Implemented mechanism to read state from file
    * Documentation
    * Created library bundler
    * Research and structure for JSON format that allows to store CoNDeT tables
* Miłosz Wrzesień
    * Created default styles
    * Implemented delete and add table mechanism
    * Implemented delete and add column mechanism
    * Implemented delete and add row mechanism
    * Created table component
    * Created display component
    * Created state modifier component