import React from 'react'
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
import { RiFullscreenFill } from "react-icons/ri";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="personal-information">
        <div className="profile-image-container">
          <form className="profile-image-div">
            <div className="image">
              <label className="upload-photo-div">
                <AiOutlineCloudUpload />
                <p>Upload Photo</p>
                <input type="file"/>
              </label>

              <div className="actions">
                <IoEyeOutline className="eye-ball" title="Profile View" />
                <RiFullscreenFill className="full-screen" title="Full Screen"/>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Dashboard