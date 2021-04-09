import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { isNil } from 'lodash'
import SocialPostListItem from 'components/Common/Social/PostList/Item'
import ProfileBlockedCard from 'components/Common/Social/ProfileBlockedCard'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import { getPostById } from 'services/social/posts'

const SocialViewOnePost = () => {
  const { postId } = useParams()
  const user = useSelector(state => state.user)

  const [post, setPost] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getPostByIdSvc = async () => {
    setIsLoading(true)
    const response = await getPostById(postId)
    if (response && !isNil(response.isBlocking)) {
      setIsBlocked(response.isBlocking)
    }
    if (response && !isNil(response.post)) {
      setPost(response.post)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  useEffect(() => {
    getPostByIdSvc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {isBlocked && <ProfileBlockedCard />}
      {!isBlocked && <SocialPostListItem user={user} post={post} isLoading={isLoading} />}
    </div>
  )
}

export default SocialViewOnePost
