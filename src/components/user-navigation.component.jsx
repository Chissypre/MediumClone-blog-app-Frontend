import { useContext } from "react"
import AnimationWrapper from "../common/page-animation"
import { UserContext } from "../App"
import { TfiWrite } from "react-icons/tfi";
import { Link } from "react-router-dom"
import { removeFromSession } from "../common/session";


const UserNavigationPanel = () => {
    const {userAuth: {username, isAdmin}, setUserAuth } = useContext(UserContext)

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({access_token:null})
    }


  return (
    <AnimationWrapper transition={{duration:0.2}} className="absolute right-0 z-50">
<div className="bg-white absolute right-0 border border-grey w-60 duration-200">
    {
        isAdmin ?
        <Link to="/editor" className="hidden md:flex gap-2 link">
<TfiWrite className="text-2xl text-black" />
    <p>Write</p>
</Link> : ""
    }

<Link to={`/user/${username}`} className="link ol-8 py-4">
    Profile
</Link>
<Link to="/dashboard/blogs" className="link pl-8 py-4">
    Dashboard
</Link>
<Link to="/settings/edit-profile" className="link pl-8 py-4">
    Settings
</Link>
<span className="absolute border-t border-grey ml-6 w-[100%]"></span>

<button className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
onClick={signOutUser}
>
    <h1 className="font-bold text-xl mg-1">Sign Out</h1>
    <p className="text-dark-grey">@username</p>
</button>
    </div>
    </AnimationWrapper>
    
  )
}

export default UserNavigationPanel