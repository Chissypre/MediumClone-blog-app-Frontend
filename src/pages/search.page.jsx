import axios from "axios"
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { filterPaginationData } from '../common/filter-pagination-data'
import AnimationWrapper from '../common/page-animation'
import BlogPostCard from '../components/blog-post.component'
import InPageNavigation from '../components/inpage-navigation.component'
import LoadMoreDataBtn from '../components/load-more.component'
import Loader from '../components/loader.component'
import NoDataMessage from '../components/nodata.component'
import UserCard from "../components/usercard.component"
import { FaRegUser } from "react-icons/fa6";


const SearchPage = () => {
  let {query} =useParams()
  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);
  const searchBlogs = ({page = 1, create_new_arr = false}) =>{
    axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {query, page})
    .then(async({ data }) => {
      let formateData = await  filterPaginationData({
        state:blogs,
        data:data.blogs,
        page,
        countRoute:"/search-blogs-count",
        data_to_send:{query},
        create_new_arr
      })
      setBlogs(formateData);
    })
    .catch((err) => {
      console.log(err);
    });
  }

const fetchUsers = () => {
  axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", {query})
    .then(({ data:{users} }) => {
      setUsers(users)
    })
}


  useEffect(() => {
    resetState()
   searchBlogs({page:1, create_new_arr:true})
   fetchUsers()
  }, [query]);

  const resetState = () => {
    setBlogs(null)
    setUsers(users)
  }

const UserCardWrapper = () => {
  return (
    <>
    {
      users === null ? <Loader/> :
      users.length?
      users.map((user, i) => {
        return <AnimationWrapper key={i} transition={{duration:1, delay:1 * 0.08}}>
          <UserCard user={user}/>
        </AnimationWrapper>
      })
      : <NoDataMessage message="No user found"/>
    }
    </>
  )
}


  return (
    <section className='h-cover flex justify-center gap-10'>
<div className='w-full'>
<InPageNavigation routes={[`Search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
<>

   {blogs === null ? (
    <Loader />
  ) : (
    blogs.results.length?
    blogs.results.map((blog, i) => {
      return (
        <AnimationWrapper
          key={i}
          transition={{ duration: 1, delay: i * 0.1 }}
        >
          <BlogPostCard
            content={blog}
            author={blog.author.personal_info}
          />
        </AnimationWrapper>
      );
    })
    :<NoDataMessage message="No Blogs Published."/>
  )}
  <LoadMoreDataBtn state={blogs} fetchDataFun ={searchBlogs}/>

</>
<UserCardWrapper/>
</InPageNavigation>
</div>
<div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
  <div className="flex">
<h1 className="font-medium text-xl mb-8">User related to search</h1>
<FaRegUser className="ml-3 mt-1.5"/>
</div>
<UserCardWrapper/>
</div>
    </section>
  )
}

export default SearchPage