import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuth } from "../../provider/authProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDeleteForever } from "react-icons/md";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string; // Assuming status is a string
  due_date: Date;
  priority: number;
};

interface Props {
  task: Task;
  currentPage: number;
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  sortKey: string;
  sortOrder: number;
}

const TaskItem: React.FC<Props> = ({
  task,
  currentPage,
  setAllTasks,
  setTotalPages,
  sortKey,
  sortOrder,
}) => {
  const { token } = useAuth();
  const naviagte = useNavigate();
  const [status, setStatus] = useState<string>(task.status);
  const [editingDate, setEditingDate] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<Date>(task.due_date);

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const newStatus = e.target.value;
    setStatus(newStatus);
    axios
      .put(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/setStatus`,
        {
          taskId: task._id,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Status updated successfully");
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const handleDateClick = () => {
    setEditingDate(!editingDate);
  };

  const handleDateChange = (date: Date) => {
    setDueDate(date);
  };

  const handleDateBlur = () => {
    setEditingDate(false);
    setDueDate(dueDate);
    axios
      .put(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/setDueDate`,
        {
          taskId: task._id,
          dueDate: dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Date updated successfully");
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const handleDelete = async () => {
    await axios
      .put(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/deleteTask`,
        {
          taskId: task._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Delete successfully");
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/getAllTasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            limit: 10, // Assuming 10 tasks per page
            sort: `${sortKey},${sortOrder}`,
          },
        }
      );

      const { tasks, totalPages } = response.data;
      setAllTasks(tasks);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <tr
      className={` cursor-pointer  ${
        task.status === "DONE" ? "bg-gray-400 " : "hover:bg-gray-100"
      }`}
    >
      <td className="py-2 px-4">{task.title}</td>
      <td className="py-2 px-4">{task.description}</td>
      <td className="py-2 px-4">{task.priority}</td>
      <td className="py-2 px-4">
        <select
          name="status"
          id="status"
          value={status}
          disabled={task.status === "DONE"}
          onChange={(e) => {
            handleStatusChange(e);
          }}
          className={`${status === "TODO" ? "bg-red-500" : ""} ${
            status === "IN_PROGRESS" ? "bg-yellow-500" : ""
          } ${status === "DONE" ? "bg-green-500" : ""}
            text-white text-center font-semibold border rounded disabled:border-0`}
        >
          <option className="bg-white text-black" value="TODO">
            TODO
          </option>
          <option className="bg-white text-black" value="IN_PROGRESS">
            IN_PROGRESS
          </option>
          <option className="bg-white text-black" value="DONE">
            DONE
          </option>
        </select>
      </td>
      <td className="py-2 px-4">
        {editingDate && task.status !== "DONE" ? (
          <div className="w-24">
            <DatePicker // Use react-datepicker component
              value={new Date(dueDate).toLocaleDateString().split("T")[0]}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              className="w-24"
              placeholderText="Select Due date"
              disabled={task.status === "DONE"}
            />
          </div>
        ) : (
          <span onClick={handleDateClick}>
            {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </td>
      <td className="py-2 px-4 flex space-x-4">
        <MdDeleteForever
          className="text-xl  hover:scale-150 font-extrabold transition duration-300 ease-in-out"
          onClick={handleDelete}
        />

        <MdKeyboardArrowRight
          className="text-2xl text-orange-500 hover:rounded-full hover:scale-150 font-extrabold transition duration-300 ease-in-out"
          onClick={() => {
            naviagte(`/task/${task._id}`);
          }}
        />
      </td>
    </tr>
  );
};

export default TaskItem;
