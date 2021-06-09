<!-- -->

#CoNDeT 
###_Contextual Networked Decision Tables_

#### 1 Requirements

Main objective of this project was creation of light JavaScript library without using any frameworks that would allow users to freely visualize and edit CoNDeT table. Library should allow to save current visualization state to JSON file and load JSON file from user device.

#### 2 Reults

##### 2.1 Achived Result
Library is fully functional with ways to improve. During development we were able to complete all necesarry basic requirements. Visualized CoNDeT table have all of ellements visable and can be moved freely during visualization. When edit mode is active user has avalible large selection of edit options:
 1. Adding  rows and columns
 2. Removing rows and columns 
 3. Modifying cells and table properties
 4. Creating new connections
 5. Deleting a table

 Users are able to read saved state from JSON file and save it on their device in JSON format. 

##### 2.2 Possible future development

* Adding data and connection validation - without it whole responibility is on user
* Adding history to allow users to go back to previous states 
* Addint keyboard navigation
* Improving UI to make it more accesable to users

#### 3 Installation and setup

1. Use library/builder.py to build - you can skip this step if you didn't make any changes in project
2. From library/dist/ copy CoNDeT.js filet to your HTML file as < script >
3. Add styles to your HTML file if you want to customize CoNDeT table visualization

#### 4 Usage

1. Ability to move ConDeT table freely on window:
    
    State before moving:
    
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/Display1.jpg?raw=true )

    State after moving:
![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/Displa2.jpg?raw=true )

    As we can see tables moved in our window but their state state didn't change between them 

2. Ability to change connection state in edit mode
   
   State before changing moving table:

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/EditMode1.jpg?raw=true)

    State after moving table:

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode2.jpg?raw=true )

    As we can see unlike in display mode state of connection between two tables changed

3.  Ability to remove column:

    To remove column you need to click **X**  visable on top of choosen column in lower table

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode3rcolumn.jpg?raw=true )

    As we can see colummn B1 was deleted from Minor table

4. Ability to remove row

    To remove row you need click **X** visable on left side of choosen column in lower table

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode4rrow.jpg?raw=true )

    Second row in Minor table was removed

5. Ability to modify cell

    To modify cell we need to double click choosen cell 

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode5modifycell1.jpg?raw=true )

    After double click cell goes in edit mode and we can enter our data. To close cell edit mode we need to press **ENTER** that will close cell edit and save our modification

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode6modiffcell2.jpg?raw=true )

    We can see new data inserted into our cell

6. Ability to modify table properties

    To modify table properties we need to double click on top table part. That will allow us to enter edit mode  

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode7modiffytableproperties.jpg?raw=true )

    After double click we table properties goes to edit mode and we can modify them. To close edit mode and save our modifications we need to press **ENTER**

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode7modiffytableproperties2.jpg?raw=true )

    We can see modified table properties.

7. Ability to add new connection

    To add new conection we need to press **+** in right part of lower table from choosen row   

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode8addconnection.jpg?raw=true )

    After pressing **+** we choose table we wanted to be conected to.
    
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode8addconnection2.jpg?raw=true )

    After choosing our table we can see new connection appearing 

8. Ability to delete Tables

    To delete our table we need to press **X** in top left corner of our table

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editMode9deleteTable.jpg?raw=true )

    State after deletion

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editMode9deleteTable2.jpg?raw=true )


9. Ability to add new Table

    To add new Table we need to double click free space in our window

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode10addTable.jpg?raw=true )

    After double click we see new window that appered. We will see three of them showing up with each of them asking us for table properties values.

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode10addTable2.jpg?raw=true )

    As we see new table appered with data we inserted 


10. Ability to add new columns

    To add new column we need to press **+** that is in top part of lower table. First **+** allows us to add new _condition_ and second one to add new _decision value_

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode11addcolumn.jpg?raw=true )

    We see that window show up that ask us for value we wants our _condition_ or _decision value_ to has
    
    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode11addcolumn2.jpg?raw=true )

    We see that new columns appered

11. Ability to add new row

    To add new row we need to click **+** that we see in bottom left part of lower table

    ![](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode12addrow.jpg?raw=true )

    After clicking **+** sign we see new empty row that appered

#### 5 Contributors

* Emil Sroka
    * Architecture
    * Project managment
    * Created Example of library usage
    * Implemented mechanism that allowed moving the tables
    * Implemented cell modification
    * Implemented add and remove connection mechanism
    * Created and implemented pathfinding algorithm
    * Created connection component
    * Created SVG component
    * Created main object
* Hubet Miziołek
    * Implemented mechanism to save current state to file
    * Implemented mechanism to read state from file
    * Documentation
    * Created liblary bundler
    * Create JSON format
    * Reaserch about CoNDeT tables
* Miłosz Wrzesień
    * Created default styles
    * Implemented delete and add table mechanism
    * Implemented delete and add column mechanism
    * Implemented delete and add row mechanism
    * Created table component
    * Created display component
    * Created state modifier component