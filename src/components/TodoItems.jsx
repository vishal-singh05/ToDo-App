import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import tick from "../assets/tick.png";
import not_tick from "../assets/not_tick.png";
import delete_icon from "../assets/delete.png";

const ItemTypes = {
  TODO: "todo",
};

const TodoItems = ({
  text,
  id,
  deleteTodo,
  isComplete,
  toggle,
  startEditing,
  moveTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const saveEdit = () => {
    startEditing(id, editText);
    setIsEditing(false);
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.TODO,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemTypes.TODO,
    hover: (draggedItem) => {
      if (draggedItem.id !== id) {
        moveTodo(draggedItem.id, id);
      }
    },
  });

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={`flex items-center my-3 gap-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div
        onClick={() => {
          toggle(id);
        }}
        className="flex items-center flex-1 cursor-pointer"
      >
        <img src={isComplete ? tick : not_tick} className="w-7" alt="status" />
        {!isEditing ? (
          <p
            className={`text-slate-700 ml-4 text-[17px] decoration-slate-500 ${
              isComplete ? "line-through" : ""
            }`}
          >
            {text}
          </p>
        ) : (
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
          />
        )}
      </div>
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      ) : (
        <button onClick={saveEdit}>Save</button>
      )}
      <img
        src={delete_icon}
        className="w-5 cursor-pointer"
        onClick={() => deleteTodo(id)}
        alt="delete"
      />
    </div>
  );
};

export default TodoItems;
