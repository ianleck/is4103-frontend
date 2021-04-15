import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { SearchOutlined } from '@ant-design/icons'
import { Avatar, Input, Radio, Skeleton } from 'antd'
import searchByFilter from 'services/search'
import { useDebounce } from 'use-debounce'
import { isEmpty, isNil, map, size } from 'lodash'
import { DEFAULT_TIMEOUT, USER_TYPE_ENUM } from 'constants/constants'
import { getUserFullName, sendToSocialProfile } from 'components/utils'
import style from './style.module.scss'

let searchInput = null

const Search = ({ intl: { formatMessage } }) => {
  const history = useHistory()
  const currentUser = useSelector(state => state.user)

  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchType, setSearchType] = useState('users')

  const [isLoading, setIsLoading] = useState(false)
  const [userResults, setUserResults] = useState([])
  const [mentorshipResults, setMentorshipResults] = useState([])
  const [courseResults, setCourseResults] = useState([])

  const [query] = useDebounce(searchText, 750)

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    if (!isEmpty(query)) searchByFilterSvc(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const searchByFilterSvc = async () => {
    setIsLoading(true)
    const response = await searchByFilter(query)

    if (response && !isNil(response.success)) {
      if (!isNil(response.users)) setUserResults(response.users)
      if (!isNil(response.mentorships)) setMentorshipResults(response.mentorships)
      if (!isNil(response.courses)) setCourseResults(response.courses)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const showLiveSearch = () => {
    setShowSearch(true)
    setTimeout(() => {
      searchInput.focus()
    }, 100)
  }

  const changeSearchText = e => {
    setSearchText(e.target.value)
  }

  const hideLiveSearch = () => {
    searchInput.blur()
    setShowSearch('')
    setSearchText('')
    setSearchType('users')
  }

  const handleKeyDown = event => {
    if (showSearch) {
      const key = event.keyCode.toString()
      if (key === '27') {
        hideLiveSearch()
      }
    }
  }

  const handleNode = node => {
    searchInput = node
  }

  const NoResultsFound = () => {
    return (
      <div className={style.results}>
        <span>No Results Found</span>
      </div>
    )
  }

  const sendToPage = (type, id) => {
    setShowSearch(false)
    if (type === 'user') {
      sendToSocialProfile(currentUser, history, id)
    }
    if (type === 'mentorship') {
      if (currentUser.userType === USER_TYPE_ENUM.ADMIN) {
        history.push(`/admin/mentorship-content-management`)
      } else {
        history.push(`/student/mentorship/view/${id}`)
      }
    }
    if (type === 'course') {
      if (currentUser.userType === USER_TYPE_ENUM.ADMIN) {
        history.push(`/admin/course-content-management/${id}`)
      } else {
        history.push(`/courses/${id}`)
      }
    }
  }

  const getBackgroundImage = (type, object) => {
    if (type === 'user')
      return object?.profileImgUrl ? object.profileImgUrl : '/resources/images/avatars/avatar-2.png'
    if (type === 'mentorship')
      return object.Sensei?.profileImgUrl
        ? object.Sensei?.profileImgUrl
        : '/resources/images/avatars/avatar-2.png'
    if (type === 'course')
      return !isNil(object.imgUrl) ? object.imgUrl : '/resources/images/course-placeholder.png'
    return null
  }

  const SearchRowItem = ({ type, user, listing, course }) => {
    return (
      <Skeleton active loading={isLoading} paragraph={false} className="w-50">
        <div
          role="button"
          tabIndex={0}
          className="defocus-btn clickable row align-items-center mb-4"
          onClick={() => {
            if (type === 'user') sendToPage(type, user.accountId)
            if (type === 'mentorship') sendToPage(type, listing.mentorshipListingId)
            if (type === 'course') sendToPage(type, course.courseId)
          }}
          onKeyDown={e => e.preventDefault()}
        >
          {type === 'user' && (
            <div className="col-auto">
              <Avatar src={getBackgroundImage('user', user)} />
            </div>
          )}

          <div className="col-auto">
            {type === 'course' && (
              <div
                className={style.resultThumb}
                style={{
                  backgroundImage: `url(${getBackgroundImage('course', course)})`,
                }}
              />
            )}
            {type === 'mentorship' && (
              <div
                className={style.resultThumb}
                style={{
                  backgroundImage: `url(${getBackgroundImage('mentorship', listing)})`,
                }}
              />
            )}
          </div>

          <div className="col">
            <div className="row text-dark">
              <div className="col-12">
                {type === 'user' && (
                  <>
                    <span className="h5 font-weight-bold">{getUserFullName(user)}</span>
                    <br />
                    <span className="text-muted">{user.username}</span>
                  </>
                )}
                {type === 'mentorship' && (
                  <>
                    <span className="h5 font-weight-bold">{listing.name}</span>
                    <br />
                    <span className="text-muted">{getUserFullName(listing.Sensei)}</span>
                  </>
                )}
                {type === 'course' && (
                  <>
                    <span className="h5 font-weight-bold">{course.title}</span>
                    <br />
                    <span className="text-muted">{getUserFullName(course.Sensei)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    )
  }

  return (
    <div className="text-center text-lg-right">
      <Input
        className={style.extInput}
        placeholder={formatMessage({ id: 'topBar.typeToSearch' })}
        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        style={{ width: 150 }}
        onFocus={showLiveSearch}
      />
      <div
        className={`${
          showSearch ? `${style.livesearch} ${style.livesearchVisible}` : style.livesearch
        }`}
        id="livesearch"
      >
        <button className={style.close} type="button" onClick={hideLiveSearch}>
          <i className="icmn-cross" />
        </button>
        <div className="container-fluid text-left">
          <div className={style.wrapper}>
            <input
              type="search"
              className={style.searchInput}
              value={searchText}
              onChange={changeSearchText}
              id="livesearchInput"
              placeholder={formatMessage({ id: 'topBar.typeToSearch' })}
              ref={handleNode}
            />
            {!searchText && <NoResultsFound />}
            {searchText && (
              <div className={style.results}>
                <div className={style.resultsTitle}>
                  <span>Search Results</span>
                </div>
                {currentUser.userType !== USER_TYPE_ENUM.SENSEI && (
                  <div className="row mb-4">
                    <div className="col-auto">
                      <Radio.Group defaultValue="users" size="large">
                        <Radio.Button value="users" onClick={() => setSearchType('users')}>
                          Users ({size(userResults)})
                        </Radio.Button>
                        <Radio.Button
                          value="mentorships"
                          onClick={() => setSearchType('mentorships')}
                        >
                          Mentorships ({size(mentorshipResults)})
                        </Radio.Button>
                        <Radio.Button value="courses" onClick={() => setSearchType('courses')}>
                          Courses ({size(courseResults)})
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="overflow-y-scroll w-50 text-left" style={{ maxHeight: '50vh' }}>
              {searchText &&
                searchType === 'users' &&
                size(userResults) > 0 &&
                map(userResults, user => {
                  return <SearchRowItem type="user" user={user} key={user.accountId} />
                })}
              {searchText && searchType === 'users' && size(userResults) === 0 && (
                <NoResultsFound />
              )}
              {searchText &&
                searchType === 'mentorships' &&
                size(mentorshipResults) > 0 &&
                map(mentorshipResults, listing => {
                  return (
                    <SearchRowItem
                      type="mentorship"
                      listing={listing}
                      key={listing.mentorshipListingId}
                    />
                  )
                })}
              {searchText && searchType === 'mentorships' && size(mentorshipResults) === 0 && (
                <NoResultsFound />
              )}
              {searchText &&
                searchType === 'courses' &&
                size(courseResults) > 0 &&
                map(courseResults, course => {
                  return <SearchRowItem type="course" course={course} key={course.courseId} />
                })}
              {searchText && searchType === 'courses' && size(courseResults) === 0 && (
                <NoResultsFound />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default injectIntl(Search)
