from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from pydantic import BaseModel


SUPABASE_URL = "https://lopkesuxzyavxmerywjf.supabase.co"
SUPABASE_KEY = ""

with open("supabase_key.txt", "r") as f:
    SUPABASE_KEY = f.read()

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    title: str
    description: str
    id: int


@app.get("/getTodos")
def get():
    response = (supabase.table("Todos").select("*").order("id").execute())
    return response.json()

@app.post("/addTodo")
def addTodo(todo: Todo):
    supabase.table("Todos").insert({"title": todo.title, "description": todo.description}).execute()


@app.post("/removeTodo")
def remove(id: int = Body(...)):
    supabase.table("Todos").delete().eq("id", id).execute()

@app.post("/updateTodo")
def update( todo: Todo):
    print("update?")
    supabase.table("Todos").update({"title": todo.title, "description": todo.description}).eq("id", todo.id).execute()


