import "./App.css";
import TaskContainer from "./components/taskContainer";
import { useEffect, useState } from "react";
import Modal from "./components/modal";

function App() {
  const [taskObject, setTaskO] = useState({ todo: [], progress: [], done: [] }); //tasks object
  const [activeTask, setActiveTask] = useState(""); //active task
  const [contextActive, setContextActive] = useState(false); //context active
  const [addModal, setAddModal] = useState(false); //add task model
  const [modal, setModal] = useState(false);
  const [contextActiveTask, setContextActiveTask] = useState(false);
  const [tcoordinates, setTCor] = useState({ x: 0, y: 0 }); //task context coordinates
  const [coordinates, setCor] = useState({ x: 0, y: 0 }); //todo context coordinates
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sendActive, setSendActive] = useState(false);
  const [search, setSearch] = useState("");
  const [searchRes, setSearchRes] = useState({});

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setContextActive(false);
      setContextActiveTask(false);
    };
    const locStorage = JSON.parse(localStorage.getItem("mytask"));
    if (locStorage) {
      setTaskO(locStorage);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (search) {
      const searchRes = {
        todo: taskObject.todo.filter((task) =>
          task.content.toLowerCase().includes(search.toLocaleLowerCase())
        ),
        progress: taskObject.progress.filter((task) =>
          task.content.toLowerCase().includes(search.toLocaleLowerCase())
        ),
        done: taskObject.done.filter((task) =>
          task.content.toLowerCase().includes(search.toLocaleLowerCase())
        ),
      };
      setSearchRes(searchRes);
    } else {
      setSearchRes({});
    }
  }, [search]);

  const handleContext = (e) => {
    e.preventDefault();
    setContextActive(true);
    setContextActiveTask(false);
    setCor({ x: e.pageX, y: e.pageY - scrollPosition });
  };

  const handleTaskContext = (e, task) => {
    e.stopPropagation();
    e.preventDefault();
    setContextActiveTask(true);
    setContextActive(false);
    setTCor({ x: e.pageX, y: e.pageY - scrollPosition });
    setActiveTask(task);
  };

  const addNewTask = (newTask) => {
    setTaskO((prevState) => {
      prevState.todo.push(newTask);
      return prevState;
    });
    localStorage.setItem("mytask", JSON.stringify(taskObject));
  };

  const deleteTask = () => {
    if (activeTask.id)
      setTaskO((prevState) => {
        const newState = {
          ...prevState,
          [activeTask.status]: prevState[activeTask.status].filter((task) =>
            task.id === activeTask.id ? false : true
          ),
        };
        localStorage.setItem("mytask", JSON.stringify(newState));
        return newState;
      });
    setActiveTask({});
    setModal(false);
  };

  const handleSend = (status) => {
    if (activeTask.id)
      setTaskO((prevState) => {
        const newState = {
          ...prevState,
          [activeTask.status]: prevState[activeTask.status].filter((task) =>
            task.id === activeTask.id ? false : true
          ),
        };
        activeTask.status = status;

        newState[status].push(activeTask);
        localStorage.setItem("mytask", JSON.stringify(newState));
        return newState;
      });
    setActiveTask({});
  };
  return (
    <div>
      <div className="header">
        <h1>WorkBoard</h1>
        <div className="search-box">
          <input
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        <TaskContainer
          type="todo"
          tasks={searchRes.todo ? searchRes.todo : taskObject.todo}
          handleContext={handleContext}
          handleTaskContext={handleTaskContext}
        />
        <TaskContainer
          type="progress"
          tasks={searchRes.progress ? searchRes.progress : taskObject.progress}
          handleTaskContext={handleTaskContext}
        />
        <TaskContainer
          type="done"
          tasks={searchRes.done ? searchRes.done : taskObject.done}
          handleTaskContext={handleTaskContext}
        />
        {contextActive && (
          <div
            className="context-menu"
            style={{ top: `${coordinates.y}px`, left: `${coordinates.x}px` }}
          >
            <button
              onClick={() => {
                setModal(true);
                setAddModal(true);
              }}
            >
              New Task
            </button>
          </div>
        )}
        {contextActiveTask && (
          <>
            <div
              className="context-menu tasks"
              style={{
                top: `${tcoordinates.y}px`,
                left: `${tcoordinates.x}px`,
              }}
              onMouseLeave={() => setSendActive(false)}
            >
              <button onMouseEnter={() => setSendActive(true)}>Send To</button>
              <button
                onClick={() => setModal(true)}
                onMouseEnter={() => setSendActive(false)}
              >
                Delete
              </button>
              {sendActive && (
                <div
                  className="context-menu tasks-sub"
                  style={{
                    top: `0`,
                    left: `95%`,
                  }}
                  onMouseLeave={() => setSendActive(false)}
                >
                  <div>
                    <button
                      onClick={() => handleSend("todo")}
                      className={activeTask.status === "todo" ? "disabled" : ""}
                    >
                      ToDo
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handleSend("progress")}
                      className={
                        activeTask.status === "progress" ? "disabled" : ""
                      }
                    >
                      Progress
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handleSend("done")}
                      className={activeTask.status === "done" ? "disabled" : ""}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {modal && (
        <Modal
          addModal={addModal}
          setAddModal={setAddModal}
          setModal={setModal}
          addNewTask={addNewTask}
          deleteTask={deleteTask}
        />
      )}
    </div>
  );
}

export default App;
