import React from 'react'

const FeaturedCourses = () => {
  const imgSrc = '/resources/images/empty-img-placeholder.jpeg'

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-6">
          {/* ============ 1st featured course ============ */}
          {showFeaturedCourse(imgSrc)}
        </div>
        <div className="col-12 col-md-6">
          {/* ============ 2nd featured course ============ */}
          {showFeaturedCourse(imgSrc)}
        </div>
      </div>
    </div>
  )
}

const showFeaturedCourse = imgSrc => {
  return (
    <div className="card">
      <div className="card-header">Featured Course</div>
      <img src={imgSrc} className="card-img-top" alt="Empty Placeholder" />
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <h4 className="col-auto card-title">Course name</h4>
          <div className="col-auto">Course instructor</div>
        </div>
        <p className="card-text">Insert course description here</p>
        <p className="card-text">
          <small className="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
  )
}
export default FeaturedCourses
