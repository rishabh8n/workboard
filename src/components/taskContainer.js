import React from "react";

function TaskContainer({ type, tasks, handleContext, handleTaskContext }) {
  return (
    <div
      className={`${type}`}
      onContextMenu={handleContext ? handleContext : null}
    >
      <h2 className="title">{`${
        type === "todo" ? "ToDo" : type === "progress" ? "In Progress" : "Done"
      }`}</h2>
      <div className="task-container ">
        {tasks.length > 0
          ? tasks.map((task) => {
              // if (task.status === type)
              return (
                <div
                  className="task"
                  onContextMenu={(e) => handleTaskContext(e, task)}
                  key={task.id}
                  id={task.id}
                >
                  {task.content}
                </div>
              );
            })
          : "No todos to show"}
      </div>
    </div>
  );
}

export default TaskContainer;
