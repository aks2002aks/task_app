import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../provider/authProvider";
import toast from "react-hot-toast";

const CreateTask = ({ CountCreateTask }: { CountCreateTask: () => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { token } = useAuth();

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleCreateTask = async () => {
    if (!title || !description || !selectedDate) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/createTask`,
        {
          title,
          description,
          due_date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      CountCreateTask();
      toast.success("Task created successfully");
      setTitle("");
      setDescription("");
      setSelectedDate(null);
    } catch (error) {
      // Handle the error here
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-3xl flex  py-2 flex-col space-y-4">
        <div className="bg-white items-center justify-between w-full flex rounded-full shadow-lg p-2 space-x-2">
          <input
            className="font-bold rounded-full w-full py-4 pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <DatePicker // Use react-datepicker component
              selected={selectedDate}
              onChange={handleChange} // Add onChange prop
              className="font-bold rounded-full w-full py-4 pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs"
              placeholderText="Select Due date"
            />
          </div>

          <button
            className="bg-gray-600 text-white font-bold rounded-full px-4 py-2 transition duration-300 ease-in-out hover:bg-orange-600 mr-6"
            onClick={handleCreateTask}
          >
            Create
          </button>
        </div>
        <div className="bg-white items-center justify-between w-full flex rounded-md shadow-lg p-2 space-x-2">
          <textarea
            className="font-bold rounded-md w-full py-4 pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs"
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default CreateTask;
