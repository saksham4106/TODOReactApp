import { useEffect, useState } from 'react'
import './App.css'


const API = "http://localhost:8000"
function App() {
  const [todos, setTodos] = useState([])
  const [showAddTodoMenu, setShowAddTodoMenu] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [id, setID] = useState(0)

  useEffect(() => {
        getTodo();
  }, [])

  const getTodo = async() => {
          fetch(API + "/getTodos")
          .then((res) => res.json())
          .then(data => {
            data = JSON.parse(data)
            setTodos(data.data)
          })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch(API + "/addTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({title, description, id: 0})
    })
    getTodo()
  }

  const removeTodo = async(id) => {
      await fetch(API + "/removeTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(id)
      })
      getTodo()
  }

  const updateTodo = async(e) => {
    e.preventDefault()
    await fetch(API + "/updateTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( {title, description, id})
    })
    getTodo()
  }

  return (
    <>
      <ul>{todos.map(todo=> (<li key={todo.id}   style={{
        listStyle: "None",
    fontSize: "1.5rem",
    border: "1px solid white",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
    position: "relative",
    paddingLeft: "20px"

  }}> 
            <div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <h1>{todo.title}</h1>
                <div style={{display:"initial"}}>
                  <button onClick={() => removeTodo(todo.id)} style={{fontSize: "0.8rem", alignSelf: "flex-start"}}> X </button>
                  <button onClick={() => {
                    setID(todo.id);
                    setTitle(todo.title)
                    setDescription(todo.description)
                    setShowAddTodoMenu(true);
                  }} style={{fontSize: "0.8rem", alignSelf: "flex-start"}}> E </button>
                </div>
              </div>

              <h3>{todo.description}</h3>
            </div>
              
        </li>))}</ul>
      <div className="card">
        <button onClick={() => setShowAddTodoMenu(true)}> 
          Add TODO
        </button>
      </div>

       {showAddTodoMenu && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2 style={{backgroundColor: "rgba(0,0,0,0.5)"}}>{id == 0 ? "Add" : "Update"} Todo</h2>
            <form onSubmit={(e) => {
                if(id == 0){
                  handleSubmit(e)
                }else{
                  updateTodo(e)
                }
                  setID(0);
                  setTitle("");
                  setDescription("");
                  setShowAddTodoMenu(false);
                  
              }}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
              />
              <div style={styles.buttons}>
                <button type="submit">{id == 0 ? "Add" : "Update"}</button>
                <button type="button" onClick={() => {
                    setID(0);
                    setTitle("");
                    setDescription("");
                    setShowAddTodoMenu(false);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}


const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000
  },
  popup: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
    minWidth: "300px"
  },
  input: {
    width: "100%",
    marginBottom: "1rem",
    padding: "0.5rem"
  },
  textarea: {
    width: "100%",
    height: "80px",
    marginBottom: "1rem",
    padding: "0.5rem"
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between"
  }
};

export default App
