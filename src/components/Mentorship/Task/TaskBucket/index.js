import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Popconfirm } from 'antd'
import { showNotification } from 'components/utils'
import { WARNING } from 'constants/notifications'
import { map } from 'lodash'
import React, { useState } from 'react'

const TaskBucket = ({
  taskBuckets,
  showTasks,
  activeTaskBucket,
  deleteOneTaskBucket,
  addTaskBucket,
  isEditable,
}) => {
  const [input, setInput] = useState('')

  const onAddTaskBucket = () => {
    if (input === '') {
      showNotification('warn', WARNING, 'Task bucket name cannot be empty')
      return
    }
    addTaskBucket(input)
    setInput('')
  }

  return (
    <div
      role="menu"
      className="col-12"
      style={{ paddingRight: '20px', borderRight: '1px solid #e8e8e8' }}
    >
      {map(taskBuckets, (tb, i) => {
        return (
          <div
            role="menuitem"
            tabIndex={i}
            onClick={() => showTasks(tb)}
            onKeyDown={() => showTasks(tb)}
            className={`clickable bucket-items d-flex justify-content-between ${
              tb.taskBucketId === activeTaskBucket.bucket?.taskBucketId ? 'bucket-item-active' : ''
            } col-12`}
            style={{ padding: '4px 8px' }}
            key={tb.taskBucketId}
          >
            {tb.title}
            <Popconfirm
              title="Do you wish to delete this task group?"
              onConfirm={() => deleteOneTaskBucket(tb.taskBucketId)}
              okText="Delete"
              okType="danger"
            >
              <Button
                className={`${
                  tb.taskBucketId === activeTaskBucket.bucket?.taskBucketId
                    ? 'task__remove-icon'
                    : 'task__remove-icon-hidden'
                }`}
                size="small"
                shape="circle"
                icon={<CloseOutlined style={{ fontSize: '12px' }} />}
                disabled={!isEditable}
              />
            </Popconfirm>
          </div>
        )
      })}
      <Input.Search
        placeholder="Add new task bucket"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={!isEditable}
        onSearch={() => onAddTaskBucket()}
        enterButton={<Button type="default" disabled={!isEditable} icon={<PlusOutlined />} />}
      />
    </div>
  )
}

export default TaskBucket
