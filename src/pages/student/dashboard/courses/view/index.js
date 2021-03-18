import BackBtn from 'components/Common/BackBtn'
import React from 'react'
import { useParams } from 'react-router-dom'

const StudentCourseDetails = () => {
  const { id } = useParams()
  console.log(id)
  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <span>View Course</span>
    </div>
  )
}

export default StudentCourseDetails
