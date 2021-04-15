import { CheckOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Progress } from 'antd'
import BackBtn from 'components/Common/BackBtn'
import NotesComponent from 'components/Mentorship/Notes'
import TaskComponent from 'components/Mentorship/Task'
import { calculateOverallProgress, showNotification } from 'components/utils'
import { CONTRACT_PROGRESS_ENUM } from 'constants/constants'
import {
  CONTRACT_COMPLETE_ERR,
  CONTRACT_COMPLETE_SUCCESS,
  ERROR,
  SUCCESS,
  WARNING,
} from 'constants/notifications'
import { isEmpty, isNil, pickBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  addTask,
  createTaskBucket,
  deleteTask,
  deleteTaskBucket,
  getContract,
  getTaskBuckets,
  terminateMentorshipContract,
  updateTask,
  updateTaskBucket,
} from 'services/mentorship/contracts'

const MentorshipContract = () => {
  const { id } = useParams()
  const [contract, setContract] = useState([])
  const [overallTaskProgress, setOverallTaskProgress] = useState(0)
  const [showCompletePopConfirm, setShowCompletePopConfirm] = useState(false)
  const [isContractOngoing, setisContractOngoing] = useState(false)

  const [taskBuckets, setTaskBuckets] = useState([])
  const [activeTaskBucket, setActiveTaskBucket] = useState({
    bucket: {},
    tasks: [],
  })

  const getMentorshipContract = async () => {
    const response = await getContract(id)
    if (response && !isNil(response.contract)) {
      setContract(response.contract)
      if (!isNil(response.contract.progress)) {
        setisContractOngoing(response.contract.progress === CONTRACT_PROGRESS_ENUM.ONGOING)
      }
    }
  }

  const getTaskBucketsData = async () => {
    const res = await getTaskBuckets(id)
    if (res) {
      console.log('res is ', res)
      console.log('updated state =', activeTaskBucket)
      setTaskBuckets(res.taskBuckets)
      setOverallTaskProgress(calculateOverallProgress(res.taskBuckets))
      return res.taskBuckets
    }
    return []
  }

  useEffect(() => {
    getMentorshipContract()
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
  }, [])

  // ======================== MENTORSHIP CONTRACT FUNCTIONS ========================

  const onCompleteContract = async () => {
    const response = await terminateMentorshipContract({
      mentorshipContractId: id,
      action: CONTRACT_PROGRESS_ENUM.COMPLETED,
    })

    if (response) {
      showNotification('success', SUCCESS, CONTRACT_COMPLETE_SUCCESS)
      getMentorshipContract()
      setShowCompletePopConfirm(false)
    } else {
      showNotification('error', ERROR, CONTRACT_COMPLETE_ERR)
    }
  }

  // ======================== TASK BUCKETS OPERATIONS ========================

  const addTaskBucket = async title => {
    if (!title || title === '') {
      showNotification('warn', WARNING, 'Task bucket name cannot be empty')
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
    console.log('rearrange task')
    const newTaskOrder = tasksData.map(t => t.taskId)
    const taskBucket = {
      ...activeTaskBucket.bucket,
      taskOrder: newTaskOrder,
    }
    const res = await updateTaskBucket(activeTaskBucket.bucket.taskBucketId, taskBucket)
    if (res && !isNil(res.updatedTaskBucket)) {
      const rearrangedTasks = [...tasksData]
      setActiveTaskBucket({
        bucket: res.updatedTaskBucket,
        tasks: rearrangedTasks,
      })
      getTaskBucketsData()
    }
  }

  const deleteOneTaskBucket = async taskBucketId => {
    const res = await deleteTaskBucket(taskBucketId)
    if (res) {
      showNotification('success', SUCCESS, res.message)
      getTaskBucketsData()
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
      const updatedTasks = isEmpty(activeTaskBucket.bucket.Tasks)
        ? []
        : activeTaskBucket.bucket.Tasks && [...activeTaskBucket.bucket.Tasks]
      updatedTasks.push(res.createdTask)
      const updatedTaskBucket = {
        bucket: activeTaskBucket.bucket,
        tasks: updatedTasks,
      }
      showNotification('success', SUCCESS, res.message)
      setActiveTaskBucket(updatedTaskBucket)
      getTaskBucketsData()
    }
  }

  const showTasks = taskBucket => {
    const Tasks = (taskBucket.Tasks && [...taskBucket.Tasks]) || []
    console.log('showTasks')
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
      getTaskBucketsData()
    }
  }

  const deleteOneTask = async taskId => {
    const res = await deleteTask(taskId)
    console.log('activeTaskBucket is ', activeTaskBucket)
    const updatedTasks = pickBy(activeTaskBucket.tasks, task => task.taskId !== taskId)

    console.log('updatedTasks are ', updatedTasks)
    if (res) {
      showNotification('success', SUCCESS, res.message)
      setActiveTaskBucket({
        bucket: activeTaskBucket.bucket,
        tasks: updatedTasks,
      })
      setTimeout(() => {
        console.log('updated state =', activeTaskBucket)
      }, 1000)
      getTaskBucketsData()
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

  // ======================== MISC FUNCTIONS ========================
  const getPopconfirmTitle = () => {
    const main = 'Do you wish to mark this mentorship contract as completed? '

    const addendum =
      overallTaskProgress < 100
        ? 'There are still incomplete tasks.'
        : 'All tasks have been completed.'

    return main + addendum
  }

  // ======================== COMPONENTS ========================

  const DetailsComponent = () => (
    <div className="card">
      <div className="card-body">
        <div className="card-title"> Mentorship Contract:</div>
        <div className="card-text">{contract.mentorshipContractId}</div>
      </div>
      <small className="card-footer">Progress: {contract.progress}</small>
    </div>
  )

  const ProgressComponent = () => (
    <div className="card">
      <div className="card-body">
        <small className="text-muted">Overall Tasks Progress</small>
        <Progress percent={overallTaskProgress} size="small" />
        <hr />
        <div className="row">
          <div className="col-12">
            <Popconfirm
              title={getPopconfirmTitle()}
              onConfirm={() => onCompleteContract()}
              onCancel={() => setShowCompletePopConfirm(false)}
              okText="Yes"
              okType="danger"
              visible={showCompletePopConfirm}
              placement="bottom"
            >
              <Button
                block
                type="default"
                size="large"
                onClick={() => setShowCompletePopConfirm(true)}
                icon={<CheckOutlined className="text-success" />}
                disabled={!isContractOngoing}
              >
                Complete Mentorship
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="row pt-2 justify-content-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row pt-4">
        <div className="col-12 col-lg-7">
          <DetailsComponent />
        </div>
        <div className="col-12 col-lg-5">
          <ProgressComponent />
        </div>
      </div>
      <TaskComponent
        activeTaskBucket={activeTaskBucket}
        addEmptyTask={addEmptyTask}
        addTaskBucket={addTaskBucket}
        deleteOneTask={deleteOneTask}
        deleteOneTaskBucket={deleteOneTaskBucket}
        isEditable={isContractOngoing}
        progressNumber={progressNumber}
        rearrangeTasks={rearrangeTasks}
        showTasks={showTasks}
        taskBuckets={taskBuckets}
        updateActiveTasks={updateActiveTasks}
        updateOneTask={updateOneTask}
      />
      <br />
      <NotesComponent isEditable={isContractOngoing} />
    </div>
  )
}

export default MentorshipContract
