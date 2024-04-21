import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import './ViewPosts.scss'
import AddPostForm from '../AddPostForm/AddPostForm'

import { BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import moment from 'moment'


const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  if (numWords >= words.length) {
    return text;
  }
  return words.slice(0, numWords).join(' ') + ' ...';
};

function ViewPosts({ posts, fetchPosts }) {
  const accessToken = localStorage.getItem('token')
  const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
  const history = useHistory()

  const [viewPostForm, setViewPostForm] = useState(false)
  const [showFullText, setShowFullText] = useState(false);
  return (
    <section className="posts-container">
      {viewPostForm && (<AddPostForm viewPostForm={viewPostForm} setViewPostForm={setViewPostForm} fetchPosts={fetchPosts} />)}
      <div className="add-post">
        <div className="top">
          <div className="image" style={currentUser ? {
            backgroundImage: `url(${currentUser.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          } : null} onClick={() => history.push(`/profile/${currentUser.id}`)}>

          </div>

          <button onClick={() => setViewPostForm(!viewPostForm)}>
            Write Your Problem Here...
          </button>
        </div>
      </div>

      <div className="posts">
        <div className="contents">
          {posts && posts.map((post) => (
            <div className="content">
              <div className="top">
                <div className="client-details">
                  <div className="image" style={post ? {
                    backgroundImage: `url(${post.user.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : null} onClick={() => history.push(`/profile/${post.user.id}`)}>

                  </div>
                  <p onClick={() => history.push(`/profile/${post.user.id}`)}>
                    <span className="name">{post.user.username}</span>
                    <span className="date">{moment.utc(post.date).local().startOf('seconds').fromNow()}</span>
                  </p>
                </div>

                <div className="actions">
                  <BsThreeDots />
                </div>
              </div>
              <div className="post-container">
                <p className={`details ${showFullText ? "show-all" : "limited"}`}>
                  {showFullText ? post.content : truncateWords(post.content, 30)}
                  {post.content.split(' ').length > 30 && (
                    <button
                      className="see-more"
                      style={{ display: 'inline', marginLeft: '5px' }}
                      onClick={() => setShowFullText(!showFullText)}
                    >
                      {showFullText ? "See Less" : "See More"}
                    </button>
                  )}
                </p>
                {post.image && (
                  <div className="post-image" style={post ? {
                    backgroundImage: `url(${post.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : null}>

                  </div>
                )}
                <div className="comment">
                  <span onClick={() => history.push(`/post-detail/${post.id}`)}><FaRegComment /><p>Comments</p></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ViewPosts