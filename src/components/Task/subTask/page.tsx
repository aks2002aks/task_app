import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateSubTask from "./createSubTask";
import TaskDeatils from "./taskDeatils";
import ShowAllSubTask from "./showAllSubTask";
import toast from "react-hot-toast";
import { useAuth } from "../../../provider/authProvider";
import axios from "axios";

type Props = {};

type SubTask = {
  _id: string;
  title: string;
  description: string;
  priority: number;
  created_at: Date;
  status: number;
};

const Page = (props: Props) => {
  const { token } = useAuth();
  let { taskId } = useParams();
  const [allSubTasks, setAllSubTasks] = useState<SubTask[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
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
  }, [currentPage, token, taskId, setAllSubTasks]);

  return (
    <>
      <div className="pt-28 bg-gray-50 pb-10">
        <div className="mx-auto max-w-4xl w-full">
          <CreateSubTask
            taskId={taskId as string}
            setAllSubTasks={setAllSubTasks}
            currentPage={currentPage}
            setTotalPages={setTotalPages}
          />
          <TaskDeatils taskId={taskId as string} />
          <ShowAllSubTask
            taskId={taskId as string}
            allSubTasks={allSubTasks}
            setAllSubTasks={setAllSubTasks}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
