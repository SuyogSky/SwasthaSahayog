import React, { useEffect, useState } from 'react'
import ViewPosts from './ViewPosts/ViewPosts'
import './Posts.scss'
import useAxios from '../../../utils/useAxios'
import ip from '../../../ip'
function UserPosts({ posts, user_id, fetchUserPosts }) {
  const axios = useAxios()

  return (
    <section className="user-posts-main-container">
      <ViewPosts posts={posts} user_id={user_id} fetchUserPosts={fetchUserPosts}/>
    </section>
  )
}

export default UserPosts