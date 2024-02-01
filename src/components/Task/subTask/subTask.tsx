import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useAuth } from "../../../provider/authProvider";

type SubTask = {
  _id: string;
  title: string;
  description: string;
  status: number;
  created_at: Date;
  priority: number;
};

interface Props {
  task: SubTask;
  currentPage: number;
  setAllSubTasks: React.Dispatch<React.SetStateAction<SubTask[]>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  taskId: string;
}

const SubTaskItem: React.FC<Props> = ({
  task,
  currentPage,
  setAllSubTasks,
  setTotalPages,
  taskId,
}) => {
  const { token } = useAuth();
  const [status, setStatus] = useState<number>(task.status);

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const newStatus = e.target.value;
    setStatus(parseInt(newStatus));
    axios
      .put(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/setSubTaskStatus`,
        {
          subTaskId: task._id,
          status: newStatus,
          taskId: taskId,
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

  const handleDelete = async () => {
    await axios
      .put(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/deleteSubTask`,
        {
          subTaskId: task._id,
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
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/getAllSubTasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            limit: 10,
            taskId,
          },
        }
      );

      const { subTasks, totalPages } = response.data;
      console.log(subTasks);
      setAllSubTasks(subTasks);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <tr
      className={` cursor-pointer  ${
        status === 1 ? "bg-gray-400 " : "hover:bg-gray-100"
      }`}
    >
      <td className="py-2 px-4">{task._id}</td>
      <td className="py-2 px-4">
        <select
          name="status"
          id="status"
          value={status}
          disabled={status === 1}
          onChange={(e) => {
            handleStatusChange(e);
          }}
          className={`${status === 0 ? "bg-red-500" : ""} ${
            status === 1 ? "bg-green-500" : ""
          }
            text-white text-center font-semibold border rounded disabled:border-0 p-1`}
        >
          <option className="bg-white text-black" value={0}>
            Incomplete
          </option>
          <option className="bg-white text-black" value={1}>
            Complete
          </option>
        </select>
      </td>
      <td className="py-2 px-4">
        {new Date(task.created_at).toLocaleDateString().split("T")[0]}
      </td>
      <td className="py-2 px-4 ">
        <MdDeleteForever
          className="text-xl text-center hover:scale-150 font-extrabold transition duration-300 ease-in-out"
          onClick={handleDelete}
        />
      </td>
    </tr>
  );
};

export default SubTaskItem;
