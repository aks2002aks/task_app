import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const { token, setToken } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const menuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      y: -100,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <nav className=" fixed z-50 w-full  top-0  flex flex-col justify-center items-center">
      <div className="container m-auto px-2 md:px-12 lg:px-7 bg-black mt-3 bg-opacity-70 rounded-full max-w-2xl">
        <div className="relative flex flex-wrap items-center justify-between py-3 gap-6 md:py-4 md:gap-0">
          <div className="w-full px-6 flex justify-between lg:w-max md:px-0">
            <Link to={"/"} className="flex space-x-2 items-center">
              <img
                src={"/bg-img.webp"}
                className="w-12"
                alt="tailus logo"
                width="144"
                height="133"
              />
              <span className=" hidden sm:flex text-2xl font-bold text-orange-600 cursor-pointer">
                Task Manager
              </span>
            </Link>
            <div className="-mr-2 lg:hidden text-white flex justify-center items-center">
              <button
                aria-label="humburger"
                id="hamburger"
                onClick={toggleMenu}
              >
                <GiHamburgerMenu size={30} />
              </button>
            </div>
          </div>
          <div className="hidden w-full lg:flex flex-wrap justify-end items-center space-y-6 p-6 rounded-xl bg-white md:space-y-0 md:p-0 md:flex-nowrap md:bg-transparent lg:w-7/12">
            <div className="text-gray-600 lg:pr-4">
              <ul className="flex justify-center items-center space-y-4  font-medium text-sm md:flex md:space-y-0 text-white">
                {token === null && (
                  <Link to={"/login"} className="ml-4 hover:text-orange-600">
                    Login
                  </Link>
                )}
                {token !== null && (
                  <>
                    <Link to={"/task"} className="ml-4 hover:text-orange-600">
                      Tasks
                    </Link>
                    <div
                      className="ml-4 hover:text-orange-600 cursor-pointer"
                      onClick={() => {
                        setToken(null);
                        removeCookie("token");
                      }}
                    >
                      Logout
                    </div>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          className="lg:hidden container m-auto px-2 md:px-12 lg:px-7 bg-black mt-3 bg-opacity-70 rounded-full text-white max-w-2xl"
          initial="closed"
          animate="open"
          variants={menuVariants}
        >
          <div className="relative flex flex-wrap items-center justify-between py-3 gap-6 md:py-4 md:gap-0 ">
            <div className="w-full flex flex-wrap justify-end items-center space-y-6 p-2  lg:rounded-full  md:space-y-0 md:p-0 md:flex-nowrap md:bg-transparent lg:w-7/12">
              <div className={`w-full flex md:p-2 justify-center items-center`}>
                <ul className="flex flex-wrap space-x-6  justify-center items-center">
                  {token === null && (
                    <Link to={"/login"} className="ml-4 hover:text-orange-600">
                      Login
                    </Link>
                  )}
                  {token !== null && (
                    <>
                      <Link to={"/task"} className="ml-4 hover:text-orange-600">
                        Tasks
                      </Link>
                      <div
                        className="ml-4 hover:text-orange-600 cursor-pointer"
                        onClick={() => {
                          setToken(null);
                          removeCookie("token");
                        }}
                      >
                        Logout
                      </div>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
