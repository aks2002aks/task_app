import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { useAuth } from "../../provider/authProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TaskItem from "./task";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: number;
  due_date: Date;
  status: string;
};

const ShowAllTask = ({ createCount }: { createCount: number }) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortKey, setSortKey] = useState<string>("due_date");
  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);
  const { token } = useAuth();

  useEffect(() => {
    const getAllTask = async () => {
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

    getAllTask();
  }, [currentPage, sortKey, sortOrder, token, createCount]); // Trigger the effect when currentPage, sortKey, or sortOrder changes

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 1 ? -1 : 1);
    } else {
      setSortKey(key);
      setSortOrder(1);
    }
  };

  return (
    <div className="">
      <div className="pt-12 font-bold text-2xl text-center">Your Tasks</div>
      <table className="w-full mt-4 text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th
              className="p-2 pl-4 bg-gray-200 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title{" "}
              {sortKey === "title" && (
                <span className="ml-1">
                  {sortOrder === 1 ? <>&#9650;</> : <>&#9660;</>}
                </span>
              )}
            </th>
            <th
              className="p-2 pl-4 bg-gray-200 cursor-pointer"
              onClick={() => handleSort("description")}
            >
              Description{" "}
              {sortKey === "description" && (
                <span className="ml-1">
                  {sortOrder === 1 ? <>&#9650;</> : <>&#9660;</>}
                </span>
              )}
            </th>
            <th
              className="p-2 pl-4 bg-gray-200 cursor-pointer"
              onClick={() => handleSort("priority")}
            >
              Priority{" "}
              {sortKey === "priority" && (
                <span className="ml-1">
                  {sortOrder === 1 ? <>&#9650;</> : <>&#9660;</>}
                </span>
              )}
            </th>
            <th className="p-2 pl-4 bg-gray-200 cursor-pointer">Status</th>
            <th
              className="p-2 pl-4 bg-gray-200 cursor-pointer"
              onClick={() => handleSort("due_date")}
            >
              Due Date{" "}
              {sortKey === "due_date" && (
                <span className="ml-1">
                  {sortOrder === 1 ? <>&#9650;</> : <>&#9660;</>}
                </span>
              )}
            </th>
            <th className="p-2 pl-4 bg-gray-200">Actions</th>
          </tr>
        </thead>

        <tbody>
          {allTasks.map((task) => (
            <React.Fragment key={task._id}>
              <TaskItem
                task={task}
                currentPage={currentPage}
                sortKey={sortKey}
                sortOrder={sortOrder}
                setAllTasks={setAllTasks}
                setTotalPages={setTotalPages}
              />
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="mr-2 px-3 py-1 border rounded-md bg-gray-200"
        >
          Previous
        </button>
        <div className="flex justify-center items-center mr-2">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ShowAllTask;
