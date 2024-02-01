import CreateTask from "./createTask";
import ShowAllTask from "./showAllTask";

type Props = {};

const Page = (props: Props) => {
  let createCount = 0;
  const CountCreateTask = () => {
    createCount++;
    console.log(createCount);
  };

  return (
    <>
      <div className="pt-28 bg-gray-50 pb-10">
        <div className="mx-auto max-w-4xl w-full">
          <CreateTask CountCreateTask={CountCreateTask} />
          <ShowAllTask createCount={createCount} />
        </div>
      </div>
    </>
  );
};

export default Page;
