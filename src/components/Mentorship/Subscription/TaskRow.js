import { DeleteOutlined, FileOutlined, MoreOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Dropdown, Input, Menu, message, Popconfirm, Upload } from 'antd'
import Axios from 'axios'
import StatusTag from 'components/Common/StatusTag'
import { BACKEND_API } from 'constants/constants'
import download from 'js-file-download'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const TaskRow = ({ node, updateOneTask, accessToken, deleteOneTask, updateActiveTasks }) => {
  // set data so that UI rerenders when a value is updated.
  const [data, setData] = useState({})

  useEffect(() => {
    setData(node)
  }, [node])

  const updateData = d => {
    setData(d) // update internal state
    updateOneTask(d) // call parent update task
  }

  const handleMenuClick = test => {
    const task = {
      ...data,
      progress: test.key,
    }
    updateOneTask(task)
  }

  const downloadFile = url => {
    Axios.get(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob', // Important
    }).then(resp => {
      const fileName = url.split('/mentorship/task/')[1]
      const split = fileName.split('.')
      download(resp.data, `${split[0]}.${split[1]}`)
    })
  }

  const uploadProps = taskId => {
    return {
      name: 'file',
      action: `${BACKEND_API}/upload/task/attachment/${taskId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      showUploadList: false,
      onChange(info) {
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
          const updatedTask = info.file.response.task
          updateActiveTasks(updatedTask)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="COMPLETED">COMPLETED</Menu.Item>
      <Menu.Item key="ONGOING">ONGOING</Menu.Item>
      <Menu.Item key="NOT_STARTED">NOT STARTED</Menu.Item>
    </Menu>
  )

  return (
    <div className="d-flex align-items-center justify-content-start" style={{ width: '100%' }}>
      <div className="col-12 col-md-7 d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-4 d-flex ">
          <Dropdown overlay={menu} trigger={['click']} placement="topRight" className="clickable">
            <div style={{ width: '100%' }} className="d-flex align-items-center">
              <StatusTag
                data={data.progress}
                style={{ marginRight: 0, width: '100%', padding: '0px' }}
                className="d-flex justify-content-center"
                type="TASK_PROGRESS"
              />
              <MoreOutlined />
            </div>
          </Dropdown>
        </div>
        <Input
          style={{ fontWeight: 500, marginLeft: '8px' }}
          value={data.body}
          onChange={e =>
            setData({
              ...data,
              body: e.target.value,
            })
          }
          onBlur={e => {
            if (node.body !== e.target.value) {
              // update only if value is different
              const task = { ...data, body: e.target.value }
              updateData(task)
            }
          }}
          placeholder="Add new task"
          onPressEnter={e => {
            const task = { ...data, body: e.target.value }
            updateData(task)
          }}
        />
      </div>
      <div className="col-3 d-flex justify-content-end align-items-center">
        Due at: &nbsp;
        <DatePicker
          onChange={date => {
            const task = { ...data, dueAt: date }
            updateData(task)
          }}
          defaultValue={data.dueAt ? moment(data.dueAt) : null}
        />
      </div>
      <div className="col-2 d-flex justify-content-end">
        <Upload {...uploadProps(data.taskId)}>
          <Button icon={<UploadOutlined />} shape="circle" />
        </Upload>
        <Button
          icon={<FileOutlined />}
          shape="circle"
          disabled={!data.attachmentUrl}
          onClick={() => downloadFile(data.attachmentUrl)}
        />
        <Popconfirm
          title="Do you wish to delete the task?"
          onConfirm={() => deleteOneTask(data.taskId)}
          okText="Delete"
          okType="danger"
        >
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    </div>
  )
}

export default TaskRow
