import React, { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import todo_icon from "../assets/todo_icon.png";
import TodoItems from "./TodoItems";

const Todo = () => {
  const [todoList, setTodoList] = useState(
    localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
  );
  const inputRef = useRef();

  const add = () => {
    let inputText = inputRef.current.value;
    if (inputText === "") {
      return null;
    }
    const newTodo = {
      id: Date.now(),
      isComplete: false,
      text: inputText,
    };
    setTodoList((prev) => [...prev, newTodo]);
    inputRef.current.value = "";
  };

  const deleteTodo = (id) => {
    setTodoList((prev) => {
      return prev.filter((todo) => todo.id !== id);
    });
  };

  const toggle = (id) => {
    setTodoList((prevTodo) => {
      return prevTodo.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    });
  };

  const startEditing = (id, newText) => {
    setTodoList((prevTodo) => {
      return prevTodo.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText };
        }
        return todo;
      });
    });
  };

  const moveTodo = (draggedId, hoverId) => {
    const draggedIndex = todoList.findIndex((todo) => todo.id === draggedId);
    const hoverIndex = todoList.findIndex((todo) => todo.id === hoverId);
    const updatedTodoList = [...todoList];
    const [draggedTodo] = updatedTodoList.splice(draggedIndex, 1);
    updatedTodoList.splice(hoverIndex, 0, draggedTodo);
    setTodoList(updatedTodoList);
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="bg-white place-self-center w-11/12 max-w-md
      flex flex-col p-7 min-h-[550px] rounded-xl"
      >
        {/*----------/title--------------- */}
        <div className="flex items-center mt-7 gap-2">
          <img className="w-8" src={todo_icon} alt="Todo Icon" />
          <h1 className="text-3xl font-semibold">To-Do List</h1>
        </div>

        {/*----------/inputBox--------------- */}
        <div className="flex items-center my-7 bg-gray-200 rounded-full">
          <input
            ref={inputRef}
            className="bg-transparent border-0 outline-none flex-1
            h-14 pl-6 pr-2 placeholder:text-slate-600"
            type="text"
            placeholder="Add Task"
          />
          <button
            onClick={add}
            className="border-none rounded-full bg-orange-500 w-32 h-14
          text-white text-lg font-medium cursor-pointer"
          >
            Add +
          </button>
        </div>

        {/*----------/List-Items--------------- */}
        <div>
          {todoList.map((item) => (
            <TodoItems
              key={item.id}
              text={item.text}
              id={item.id}
              deleteTodo={deleteTodo}
              isComplete={item.isComplete}
              toggle={toggle}
              startEditing={startEditing}
              moveTodo={moveTodo}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Todo;
