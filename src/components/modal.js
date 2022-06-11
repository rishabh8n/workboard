import React, { useState } from "react";

function Modal(props) {
  const [content, setContent] = useState("");
  const uid = () => {
    return (
      performance.now().toString(36) + Math.random().toString(36)
    ).replace(/\./g, "");
  };
  const handleClick = () => {
    if (content) {
      const newTask = {
        id: uid(),
        status: "todo",
        content: content,
      };
      props.addNewTask(newTask);
      setContent();
      props.setModal(false);
      props.setAddModal(false);
    }
  };

  return (
    <div
      className="overlay"
      onClick={() => {
        props.setAdd(false);
        props.setAddModal(false);
      }}
    >
      <div className="add-task modal" onClick={(e) => e.stopPropagation()}>
        {props.addModal ? (
          <>
            <div className="head">
              <h2>Add New Task</h2>
              <button
                onClick={() => {
                  props.setModal(false);
                  props.setAddModal(false);
                }}
              >
                X
              </button>
            </div>
            <textarea
              placeholder="Your Task"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            ></textarea>
            <button className="add-btn" onClick={handleClick}>
              Add
            </button>
          </>
        ) : (
          <>
            <div className="head">
              <h2>Delete Task</h2>
              <button
                onClick={() => {
                  props.setModal(false);
                }}
              >
                X
              </button>
            </div>
            <div className="cancel-main">
              <p>Are you sure?</p>
              <div>
                <button className="delete-btn" onClick={props.deleteTask}>
                  Delete
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => props.setModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Modal;
