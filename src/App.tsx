import { useEffect, useState } from "react";
import Trash from "./assets/trash-alt-svgrepo-com.svg";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<any>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://todo-list-desenvolvimento-de-software-em.onrender.com/todos"
      );
      const data = await response.json();
      if (data) {
        setTodos(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createTodo = async () => {
    try {
      setLoading(true);
      const todo = {
        title: input,
        completed: false,
        description: input,
      };
      const response = await fetch(
        "https://todo-list-desenvolvimento-de-software-em.onrender.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      );
      const data = await response.json();
      if (data) {
        setTodos([...todos, data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const updateTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(
        `https://todo-list-desenvolvimento-de-software-em.onrender.com/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        }
      );
      const data = await response.json();
      if (data) {
        const updatedTodos = todos.map((todo: any) =>
          todo.id === id ? { ...todo, completed } : todo
        );
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(
        `https://todo-list-desenvolvimento-de-software-em.onrender.com/todos/${id}`,
        {
          method: "DELETE",
        }
      );
      const updatedTodos = todos.filter((todo: any) => todo.id !== id);

      setTodos(updatedTodos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  console.log(todos);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 54,
        alignItems: "center",
      }}
    >
      <h3>Adicione aqui suas tarefas</h3>
      <div>
        <input
          type="text"
          style={{ marginRight: 14 }}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => createTodo()} disabled={loading}>
          Adicionar
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Tarefas</h3>
        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <div>
            {todos.map((todo: any) => (
              <div
                key={todo.id}
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "space-between",
                  justifyItems: "flex-starts",
                  height: 40,
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked={todo.completed}
                  onChange={(e) => updateTodo(todo.id, e.target.checked)}
                />
                <p>{todo.title}</p>
                <img
                  src={Trash}
                  alt="trash"
                  style={{ width: 20, cursor: "pointer" }}
                  onClick={() => deleteTodo(todo.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
