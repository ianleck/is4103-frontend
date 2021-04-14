import { Button, Card, Empty, notification, Progress } from 'antd'
import { showNotification } from 'components/utils'
import { SUCCESS } from 'constants/notifications'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import SortableTree from 'react-sortable-tree'
import {
  addTask,
  createTaskBucket,
  deleteTask,
  deleteTaskBucket,
  // getSubscription,
  getTaskBuckets,
  updateTask,
  updateTaskBucket,
} from 'services/mentorship/subscription'
import TaskBucket from './TaskBucket'
import TaskRow from './TaskRow'

const TaskComponent = () => {
  const { id } = useParams()
  const [taskBuckets, setTaskBuckets] = useState([])
  const [activeTaskBucket, setActiveTaskBucket] = useState({
    bucket: {},
    tasks: [],
  })
  const user = useSelector(state => state.user)

  useEffect(() => {
    // getSubscriptionsData()
    getTaskBucketsData().then(buckets => {
      if (buckets.length > 0) {
        const Tasks = [...buckets[0].Tasks]
        setActiveTaskBucket({
          bucket: buckets[0],
          tasks: Tasks,
        })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // ======================== TASK BUCKETS OPERATIONS ========================
  const getTaskBucketsData = async () => {
    const res = await getTaskBuckets(id)
    if (res) {
      setTaskBuckets(res.taskBuckets)
      return res.taskBuckets
    }
    return []
  }

  const addTaskBucket = async title => {
    if (!title || title === '') {
      notification.error('Invalid title name')
      return
    }
    const res = await createTaskBucket(id, { title })
    if (res) {
      const buckets = [...taskBuckets]
      buckets.push(res.newBucket)
      showNotification('success', SUCCESS, res.message)
      setTaskBuckets(buckets)
    }
  }

  const rearrangeTasks = async tasksData => {
    const newTaskOrder = tasksData.map(t => t.taskId)
    const taskBucket = {
      ...activeTaskBucket.bucket,
      taskOrder: newTaskOrder,
    }
    const res = await updateTaskBucket(activeTaskBucket.bucket.taskBucketId, taskBucket)
    if (res) {
      const rearrangedTasks = [...tasksData]
      const newBucket = activeTaskBucket.bucket
      newBucket.Tasks = rearrangedTasks
      setActiveTaskBucket({
        bucket: newBucket,
        tasks: rearrangedTasks,
      })
      getTaskBucketsData(id)
    }
  }

  const deleteOneTaskBucket = async taskBucketId => {
    const res = await deleteTaskBucket(taskBucketId)
    if (res) {
      showNotification('success', SUCCESS, res.message)
      getTaskBucketsData(id)
      setActiveTaskBucket({
        bucket: {},
        tasks: [],
      })
    }
  }

  // ======================== TASKS OPERATIONS ========================

  const addEmptyTask = async () => {
    const res = await addTask(activeTaskBucket.bucket.taskBucketId)
    if (res) {
      const updatedTasks =
        (activeTaskBucket.bucket.Tasks && [...activeTaskBucket.bucket.Tasks]) || []
      updatedTasks.push(res.createdTask)
      const updatedTaskBucket = {
        bucket: activeTaskBucket.bucket,
        tasks: updatedTasks,
      }
      showNotification('success', SUCCESS, res.message)
      setActiveTaskBucket(updatedTaskBucket)
      getTaskBucketsData(id)
    }
  }

  const showTasks = taskBucket => {
    const Tasks = (taskBucket.Tasks && [...taskBucket.Tasks]) || []
    setActiveTaskBucket({
      bucket: taskBucket,
      tasks: Tasks,
    })
  }

  const updateOneTask = async task => {
    const { body, dueAt, progress } = task
    const res = await updateTask(task.taskId, {
      body,
      dueAt,
      progress,
    })
    if (res) {
      showNotification('success', SUCCESS, res.message)
      updateActiveTasks(task)
      getTaskBucketsData(id)
    }
  }

  const deleteOneTask = async taskId => {
    const res = await deleteTask(taskId)
    if (res) {
      showNotification('success', SUCCESS, res.message)
      getTaskBucketsData(id)
    }
  }

  // ======================== TASKS COMPONENT FUNCTIONS ========================
  const progressNumber =
    (activeTaskBucket.tasks.length > 0 &&
      (
        (activeTaskBucket.tasks.filter(task => task.progress === 'COMPLETED').length /
          activeTaskBucket.tasks.length) *
        100
      ).toFixed(0)) ||
    0

  const updateActiveTasks = newTask => {
    const updatedTasks = activeTaskBucket.tasks.map(t => {
      if (t.taskId === newTask.taskId) {
        return newTask
      }
      return t
    })
    const newBucket = activeTaskBucket.bucket
    newBucket.Tasks = updatedTasks
    setActiveTaskBucket({
      bucket: newBucket,
      tasks: updatedTasks,
    })
  }

  return (
    <Card title="Tasks">
      <div className="row">
        <div className="col-12 col-md-3 d-flex align-items-start justify-content-center flex-column mb-md-4">
          <TaskBucket
            taskBuckets={taskBuckets}
            showTasks={showTasks}
            activeTaskBucket={activeTaskBucket}
            deleteOneTaskBucket={deleteOneTaskBucket}
            addTaskBucket={addTaskBucket}
          />
        </div>
        <div className="col-12 col-md-9 align-items-center justify-content-center flex-col">
          <div className="row d-flex align-items-center justify-content-between">
            <div className="col-xs-12 col-lg-10 p-2">
              <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '12px' }}>
                Task Progress
              </span>
              <Progress percent={progressNumber} status="active" />
            </div>
            <div className="col-xs-12 col-lg-2">
              <Button
                type="primary"
                block
                onClick={() => addEmptyTask()}
                disabled={taskBuckets.length === 0}
              >
                Add Task
              </Button>
            </div>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center height-400">
            {activeTaskBucket.tasks.length > 0 ? (
              <SortableTree
                treeData={activeTaskBucket.tasks}
                onChange={treeD => {
                  rearrangeTasks(treeD)
                }}
                generateNodeProps={({ node }) => ({
                  title: !node.children ? ( // will throw error if this check isnt there
                    <TaskRow
                      node={node}
                      accessToken={user.accessToken}
                      updateOneTask={updateOneTask}
                      updateActiveTasks={updateActiveTasks}
                      deleteOneTask={deleteOneTask}
                    />
                  ) : (
                    <span>{node.body}:</span>
                  ),
                })}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                imageStyle={{ height: 300, width: 300 }}
                description="Add a new task"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TaskComponent
