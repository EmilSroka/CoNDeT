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


User have ability to move frely  
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/Displa1.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/Displa2.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/EditMode1.jpg?raw=true)
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode2.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode3rcolumn.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode4rrow.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode5modifycell1.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode6modiffcell2.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode7modiffytableproperties.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editmode8addconnection.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editMode9deleteTable.jpg?raw=true )
![Alt text](https://github.com/EmilSroka/CoNDeT/blob/main/docs/Pictures/editMode10addTable.jpg?raw=true )

#### 5 Contributors

* Emil Sroka
    * Architecture
    * Module UI
    * Managment
* Hubet Miziołek
    * Module Data
    * Documentation
* Miłosz Wrzesień
    * Module UI
    * Module Data
    * Default styles

