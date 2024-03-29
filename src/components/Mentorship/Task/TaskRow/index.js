import { DeleteOutlined, FileOutlined, MoreOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Dropdown, Input, Menu, message, Popconfirm, Space, Upload } from 'antd'
import Axios from 'axios'
import StatusTag from 'components/Common/StatusTag'
import { BACKEND_API, TASK_PROGRESS } from 'constants/constants'
import download from 'js-file-download'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const TaskRow = ({
  node,
  updateOneTask,
  accessToken,
  deleteOneTask,
  updateActiveTasks,
  isEditable,
}) => {
  // set data so that UI rerenders when a value is updated.
  const [data, setData] = useState({})

  const dateFormat = 'YYYY-MM-DD'

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
      <Menu.Item key={TASK_PROGRESS.COMPLETED}>{TASK_PROGRESS.COMPLETED}</Menu.Item>
      <Menu.Item key={TASK_PROGRESS.ONGOING}>{TASK_PROGRESS.ONGOING}</Menu.Item>
      <Menu.Item key={TASK_PROGRESS.NOT_STARTED}>{TASK_PROGRESS.NOT_STARTED}</Menu.Item>
    </Menu>
  )

  return (
    <div className="d-flex align-items-center justify-content-start" style={{ width: '100%' }}>
      <div className="col-12 col-md-7 d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-4 d-flex">
          <Dropdown
            overlay={menu}
            trigger={['click']}
            placement="topRight"
            className="clickable"
            disabled={!isEditable}
          >
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
          disabled={!isEditable}
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
          disabled={!isEditable}
          onChange={value => {
            const task = { ...data, dueAt: value }
            updateData(task)
          }}
          value={data.dueAt && moment(data.dueAt, dateFormat)}
        />
      </div>
      <div className="col-2 d-flex justify-content-end">
        <Space size="small">
          <Upload {...uploadProps(data.taskId)}>
            <Button icon={<UploadOutlined />} shape="circle" disabled={!isEditable} />
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
            <Button type="danger" shape="circle" disabled={!isEditable} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>
    </div>
  )
}

export default TaskRow
