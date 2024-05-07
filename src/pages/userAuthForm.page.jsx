import InputBox from "../components/input.component"
import { FaRegUserCircle, FaEnvelope, FaKey} from "react-icons/fa";
import googleIcon from '../imgs/google.png'
import {Link, Navigate } from 'react-router-dom'
import AnimationWrapper from "../common/page-animation";
import { useContext, useRef } from "react";
import {Toaster, toast} from 'react-hot-toast'
import axios from 'axios'
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({type}) => {
    const authForm = useRef();

    let { userAuth, setUserAuth } = useContext(UserContext) || {};
  let { access_token } = userAuth || {};





const useAuthThroughServer = (serverRoute, formData) => {
axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
.then(({data}) =>{
storeInSession("user", JSON.stringify(data))
setUserAuth(data)
})
.catch(({response}) =>{
toast.error(response.data.error)
})
}

    const handleSubmit =(e) => {
        e.preventDefault();

      let serverRoute = type == "sign-in" ? "/signin" : "/signup"

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        //formdata
        let form = new FormData(formElement);
        let formData = {};
    
        for (let [key, value] of form.entries()) {
          formData[key] = value;
        }
        let { fullname, email, password } = formData;
        //form validation
        if(fullname){
        if(fullname.length < 3){
  return toast.error("Full name must be at least 3 characters long")
}
}
if(!email.length){
  return toast.error("Enter Email")
}
if(!emailRegex.test(email)){
  return toast.error("Email is invalid")
}
if(!passwordRegex.test(password)){
  return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters")
}
useAuthThroughServer(serverRoute, formData)
    }

const handlegoogleAuth = (e) => {
e.preventDefault();
authWithGoogle().then(user =>{
  let serverRoute = "/google-auth"
  let formData = {
access_token:user.accessToken
  }
  useAuthThroughServer(serverRoute, formData)
})
.catch(err =>{
  toast.error('trouble login through google')
  return console.log(err)
})
}


  return (
    access_token?
    <Navigate to="/" /> :
    <AnimationWrapper keyValue={type}>
    <section className="h-cover flex items-center justify-center">
        <Toaster/>
<form id="formElement" ref={authForm} className="w-[80%] max-w-[400px]">
    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
{type == "sign-in" ? "Welcome back" : "Join us today"}
    </h1>
    {
        type!=="sign-in" ?
        <InputBox
        name="fullname"
        type="text"
        placeholder="Full Name"
        IconType={FaRegUserCircle}
        />
        :""
    }
     <InputBox
        name="email"
        type="email"
        placeholder="Email"
        IconType={FaEnvelope}
        />
    <InputBox
        name="password"
        type="password"
        placeholder="Password"
        IconType={FaKey}
        />
        <button className="btn-dark center mt-14" type="submit"
        onClick={handleSubmit}>
            {type.replace("-", " ")}
        </button>
        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black"/>
            <p>or</p>
            <hr className="w-1/2 border-black"/>
        </div>
        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
        onClick={handlegoogleAuth}>
<img src={googleIcon} className="w-5" />
            continue with google
        </button>
        {
            type =="sign-in" ?
            <p className="mt-6 text-dark-grey text-xl text-center">
            Dont have an account?
            <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
            </Link>
            </p>
            :
            <p className="mt-6 text-dark-grey text-xl text-center">
            Already a member ?
            <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
            </Link>
            </p>
        }
</form>
    </section>
    </AnimationWrapper>
  )
}

export default UserAuthForm