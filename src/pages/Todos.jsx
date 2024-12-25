import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faCheck,
  faUndo,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";
import { AppRoutes } from "../constant/AppRoutes";

const Todos = () => {
  const { user, setUser } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    axios
      .get(AppRoutes.getTask, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((res) => setTodos(res.data.data));
  };

  const addTodo = () => {
    if (todo.trim() === "") return;
    axios
      .post(AppRoutes.addTask, { todo }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((res) => {
        setTodo("");
        getTodos();
      });
  };

  const handleDeleteTodo = (todoId) => {
    axios
      .delete(`${AppRoutes.deleteTask}/${todoId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then(() => getTodos());
  };

  const handleEditTodo = (todoId, updatedTodo) => {
    if(updatedTodo){

      axios
      .put(`${AppRoutes.updateTask}/${todoId}`, { todo: updatedTodo }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then(() => getTodos());
    }
   
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSaveEdit = (todoId) => {
    handleEditTodo(todoId, editText);
    setEditingTodo(null);
    setEditText("");
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-3xl mx-auto p-4">
        <header className="flex justify-center items-center mb-6">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg transition ${
              darkMode
                ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </header>

        {/* Welcome Message */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">{`Hello ${user?.fullName}`}</h2>
          <button
            onClick={() => {
              setUser(null);
              Cookies.set("token", null);
            }}
            className="bg-red-500 text-white rounded p-2 px-4"
          >
            Logout
          </button>
        </div>

        {/* Add Todo Input */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-4">
          <input
            type="text"
            placeholder="Add a new todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white focus:ring-yellow-500"
                : "focus:ring-blue-500"
            }`}
          />
          <button
            onClick={addTodo}
            disabled={todo.length < 4}
            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-3">
          {todos.map((todoData) => (
            <li
              key={todoData._id}
              className={`flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg shadow mb-3 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {editingTodo === todoData._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "border-gray-300"
                  }`}
                />
              ) : (
                <span className="flex-1 text-lg">{todoData.todo}</span>
              )}
              <div className="flex space-x-2 mt-2 sm:mt-0">
                {editingTodo === todoData._id ? (
                  <button
                    onClick={() => handleSaveEdit(todoData._id)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleEditTodo(
                          todoData._id,
                          prompt("Edit todo:", todoData.todo)
                        )
                      }
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todoData._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Message for Empty Todos */}
        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No todos yet. Add one!</p>
        )}
      </div>
    </div>
  );
};

export default Todos;




