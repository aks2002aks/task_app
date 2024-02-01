import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../provider/authProvider";
import toast from "react-hot-toast";

type Props = {};

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: number;
  due_date: Date;
  status: string;
};

const TaskDeatils = ({ taskId }: { taskId: string }) => {
  const { token } = useAuth();
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    const getAllTask = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_PUBLIC_API_URL}/api/getTaskDetails`,
          {
            taskId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { task } = response.data;
        setTask(task);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };

    getAllTask();
  }, [taskId, token]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-lg mx-auto mt-10 font-semibold">
      {task ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
          <p className="text-gray-700 mb-4">{task.description}</p>
          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/2">
              <p className="text-gray-700 mb-2">Priority: {task.priority}</p>
              <p className="text-gray-700 mb-2">
                Due Date: {new Date(task.due_date).toLocaleDateString()}
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-gray-700 mb-2">
                Status: <span className="text-green-400">{task.status}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
  );
};

export default TaskDeatils;
