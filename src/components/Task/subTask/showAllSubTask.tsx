import React from "react";
import SubTaskItem from "./subTask";

type SubTask = {
  _id: string;
  title: string;
  description: string;
  priority: number;
  created_at: Date;
  status: number;
};

const ShowAllSubTask = ({
  taskId,
  allSubTasks,
  currentPage,
  setCurrentPage,
  setTotalPages,
  totalPages,
  setAllSubTasks,
}: {
  taskId: string;
  allSubTasks: SubTask[];
  setAllSubTasks: React.Dispatch<React.SetStateAction<SubTask[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // Trigger the effect when currentPage, sortKey, or sortOrder changes

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

  return (
    <div className="">
      <div className="pt-12 font-bold text-2xl text-center">Your Sub Tasks</div>
      <table className="w-full mt-4 text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="p-2 pl-4 bg-gray-200 cursor-pointer">SubTask Id</th>
            <th className="p-2 pl-4 bg-gray-200 cursor-pointer">Status</th>
            <th className="p-2 pl-4 bg-gray-200 cursor-pointer">
              Created Date
            </th>
            <th className="p-2 pl-4 bg-gray-200">Actions</th>
          </tr>
        </thead>

        <tbody>
          {allSubTasks &&
            allSubTasks.map((task) => (
              <React.Fragment key={task._id}>
                <SubTaskItem
                  task={task}
                  currentPage={currentPage}
                  setAllSubTasks={setAllSubTasks}
                  setTotalPages={setTotalPages}
                  taskId={taskId}
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

export default ShowAllSubTask;
