
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageUtils, Job } from '../utils/localStorageUtils';
import { useNotifications } from './NotificationContext';

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => Job | undefined;
  getJobsByShipId: (shipId: string) => Job[];
  getJobsByComponentId: (componentId: string) => Job[];
  refreshJobs: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { addNotification } = useNotifications();

  const refreshJobs = () => {
    const savedJobs = localStorageUtils.getJobs();
    setJobs(savedJobs);
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  const addJob = (jobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
      ...jobData,
      id: `j${Date.now()}`
    };
    localStorageUtils.addJob(newJob);
    refreshJobs();
    
    // Add notification
    addNotification({
      type: 'job_created',
      title: 'New Job Created',
      message: `Job "${newJob.description}" has been created for ${newJob.type}`,
      userId: 'all'
    });
  };

  const updateJob = (id: string, jobData: Partial<Job>) => {
    const existingJob = jobs.find(j => j.id === id);
    localStorageUtils.updateJob(id, jobData);
    refreshJobs();
    
    // Add notification for status changes
    if (existingJob && jobData.status && jobData.status !== existingJob.status) {
      if (jobData.status === 'Completed') {
        addNotification({
          type: 'job_completed',
          title: 'Job Completed',
          message: `Job "${existingJob.description}" has been completed`,
          userId: 'all'
        });
      } else {
        addNotification({
          type: 'job_updated',
          title: 'Job Updated',
          message: `Job "${existingJob.description}" status changed to ${jobData.status}`,
          userId: 'all'
        });
      }
    }
  };

  const deleteJob = (id: string) => {
    localStorageUtils.deleteJob(id);
    refreshJobs();
  };

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  const getJobsByShipId = (shipId: string) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const getJobsByComponentId = (componentId: string) => {
    return jobs.filter(job => job.componentId === componentId);
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      addJob,
      updateJob,
      deleteJob,
      getJobById,
      getJobsByShipId,
      getJobsByComponentId,
      refreshJobs
    }}>
      {children}
    </JobsContext.Provider>
  );
};
