import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

/*
USAGE:
<div className="row pt-2">
  <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
    <BackBtn />
  </div>
</div>
*/

const BackBtn = () => {
  const history = useHistory()
  return (
    <Button
      block
      type="primary"
      size="large"
      shape="round"
      icon={<ArrowLeftOutlined />}
      onClick={() => history.goBack()}
    >
      Back
    </Button>
  )
}

export default BackBtn
