import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../provider/authProvider";

type SubTask = {
  _id: string;
  title: string;
  description: string;
  priority: number;
  created_at: Date;
  status: number;
};

const CreateSubTask = ({
  taskId,
  setAllSubTasks,
  currentPage,
  setTotalPages,
}: {
  taskId: string;
  setAllSubTasks: React.Dispatch<React.SetStateAction<SubTask[]>>;
  currentPage: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { token } = useAuth();

  const handleCreateTask = async () => {
    if (!taskId) {
      toast.error("internal error , relogin");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/createSubTask`,
        {
          taskId: taskId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const getAllTask = async () => {
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
          setAllSubTasks(subTasks);
          setTotalPages(totalPages);
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong");
        }
      };

      getAllTask();

      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-3xl flex  py-2 flex-col space-y-4">
        <div className="bg-white items-center justify-between w-full flex rounded-full shadow-lg p-2 space-x-2">
          <div className="font-bold rounded-full w-full py-4 pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs">
            Task Id : {taskId}
          </div>
          <button
            className="bg-gray-600 text-white font-bold rounded-full px-4 py-2  hover:bg-orange-600 mr-6 text-nowrap"
            onClick={handleCreateTask}
          >
            Create Sub Task
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateSubTask;
