# CoNDeT

CoNDeT is a JavaScript library for visualizing Contextual Networked Decision Tables.

## Workflow

#### Commit message conventions

The commit message should be structured as follows:
```
<type>: <description>

[optional body]
```
* type — specifies type of commit. One of follows: `fix`, `feat`, `chore`, `docs`, `example`, `styles`
* description — short sentence, started from lowercase letter and ended without dot (`.`), in present tense describes commit content
* body — additional information  
Example:
```
feat: add colorHash helper function

function allows to generate hex color based on given string
```

#### Branch conventions
One branch should correspond to one task.  
The branch name should be structured as follows:
```
<type>/<task-id>/<description>
```
* type — specifies type of task. One of follows: `fix`, `feat`, `chore`, `docs`
* task-id — id of the task 
* description — brief description of task
Example:
```
feat/21/colorHash-function
```