import { Link, Outlet } from "react-router-dom"
import darkLogo from '../imgs/logo-dark.png'
import lightLogo from '../imgs/logo-light.png'
import { useState, useEffect } from "react"
import { BsSearch } from "react-icons/bs"
import { TfiWrite } from "react-icons/tfi";
import { FaRegBell } from "react-icons/fa6";
import { useContext } from "react";
import { ThemeContext, UserContext } from "../App";
import { FaCircle } from "react-icons/fa";
import { FaRegMoon } from "react-icons/fa";
import UserNavigationPanel from "./user-navigation.component";
import {useNavigate } from 'react-router-dom'
import axios from 'axios'
import { document } from "postcss";
import { storeInSession } from "../common/session";
import { MdOutlineWbSunny } from "react-icons/md";

const Navbar = () => {
const [searchBoxVisibility, setSearchBoxVisibility] =useState(false)
const [userNavPanel, setUserNavPanel] = useState(false)

const navigate = useNavigate()
const { theme, setTheme} = useContext(ThemeContext) ;
const { userAuth, setUserAuth } = useContext(UserContext) || {};
  const { access_token, profile_img, new_notification_available, isAdmin } = userAuth || {};

  useEffect(() => {
    if (access_token) {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {}, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [access_token]);
  

  const handleUserNavPanel = () => {
    setUserNavPanel(currentVal=>!currentVal);
  }

const handleSearch = (e) => {
let query = e.target.value
if(e.keyCode == 13 && query.length){
  navigate(`/search/${query}`)
}
}

const handleBlur = () =>{
 setTimeout(()=>{
  setUserNavPanel(false)
 }, 200);
}
const changeTheme = () => {
  let newTheme = theme == "light" ? "dark" : "light"
  setTheme(newTheme)
  document.body.setAttribute("data-theme", newTheme)
  storeInSession("theme", newTheme)
}
  return (
    <>
    <nav className='navbar z-50'>
        <Link to='/' className='flex-none w-10'>
        <img src={theme === "light" ? darkLogo : lightLogo} className='w-full'/>
        </Link>
        
       <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-grey py-4 px-[5vw] md:border-0 md:black md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
        <input type="text"
        placeholder="Search"
        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey
         md:pl-12"
         onKeyDown={handleSearch} />
       <BsSearch className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey" />
       </div>
       <div className="flex items-center gap-1 md:gap-6 ml-auto">
<button className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
onClick={() => setSearchBoxVisibility(currentVal=>!currentVal)}>
    <BsSearch className="text-xl"/>
</button>
{ isAdmin ?
<Link to="/editor" className="hidden md:flex gap-2 link">
<TfiWrite className="text-2xl text-black" />
    <p>Write</p>
</Link> : ""
}
{
  theme === "light" ? (
<FaRegMoon className="cursor-pointer h-6 w-6" onClick={changeTheme} />
  ) : (
    <MdOutlineWbSunny className="cursor-pointer h-6 w-6" onClick={changeTheme} />
  )
}

{
  access_token?
 <>
 <Link to="/dashboard/notifications">
 <button className="w-12 h-12 rounded-full flex bg-grey relative hover:bg-black/10">
 
 
 <FaRegBell className=" m-auto w-full" />
 {
  new_notification_available ? <span className="bg-red text-red absolute w-3 h-3 rounded-full top-2 right-2"></span> : ""
 }
 </button>
 
 </Link>
 <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
  <button className="w-12 h-12 mt-1">
    <img src={profile_img}
    className="w-full h-full object-cover rounded-full" />
  </button>
  {
 userNavPanel?
 <UserNavigationPanel/>
 :""
  }
 
 </div>
 </>
  :
  <>
  <Link className="btn-dark py-2" to="/signin">
    Sign In
</Link>
<Link className="btn-light py-2 hidden md:block" to="/signup">
    Sign Up
</Link>
  </>
}

       </div>
    </nav>
    <Outlet/>
    </>
  )
}

export default Navbar