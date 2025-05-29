
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useJobs } from '../../contexts/JobsContext';
import { useShips } from '../../contexts/ShipsContext';
import { useComponents } from '../../contexts/ComponentsContext';
import { localStorageUtils, Job } from '../../utils/localStorageUtils';
import { toast } from "sonner";
import { format } from 'date-fns';

interface JobFormProps {
  job?: Job | null;
  onClose: () => void;
  onSave: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onClose, onSave }) => {
  const { addJob, updateJob } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const [formData, setFormData] = useState({
    description: '',
    shipId: '',
    componentId: '',
    type: 'Inspection' as Job['type'],
    priority: 'Medium' as Job['priority'],
    status: 'Open' as Job['status'],
    assignedEngineerId: '',
    scheduledDate: '',
    estimatedHours: 0,
    actualHours: 0,
    completedDate: ''
  });

  const engineers = localStorageUtils.getUsers().filter(user => user.role === 'Engineer');
  const availableComponents = formData.shipId 
    ? components.filter(c => c.shipId === formData.shipId)
    : [];

  useEffect(() => {
    if (job) {
      setFormData({
        description: job.description,
        shipId: job.shipId,
        componentId: job.componentId,
        type: job.type,
        priority: job.priority,
        status: job.status,
        assignedEngineerId: job.assignedEngineerId,
        scheduledDate: job.scheduledDate,
        estimatedHours: job.estimatedHours,
        actualHours: job.actualHours || 0,
        completedDate: job.completedDate || ''
      });
    } else {
      // Set default date for new jobs
      setFormData(prev => ({
        ...prev,
        scheduledDate: format(new Date(), 'yyyy-MM-dd')
      }));
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.shipId || !formData.componentId || !formData.assignedEngineerId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const jobData = {
        ...formData,
        createdDate: job?.createdDate || new Date().toISOString(),
        // Set completed date when status is completed
        completedDate: formData.status === 'Completed' ? (formData.completedDate || new Date().toISOString()) : undefined
      };

      if (job) {
        updateJob(job.id, jobData);
        toast.success('Job updated successfully');
      } else {
        addJob(jobData);
        toast.success('Job created successfully');
      }
      onSave();
    } catch (error) {
      toast.error('Error saving job');
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset component when ship changes
    if (field === 'shipId') {
      setFormData(prev => ({ ...prev, componentId: '' }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job' : 'Create New Job'}</DialogTitle>
          <DialogDescription>
            {job ? 'Update job information' : 'Enter job details for maintenance task'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipId">Ship *</Label>
              <Select value={formData.shipId} onValueChange={(value) => handleChange('shipId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ship" />
                </SelectTrigger>
                <SelectContent>
                  {ships.map((ship) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="componentId">Component *</Label>
              <Select 
                value={formData.componentId} 
                onValueChange={(value) => handleChange('componentId', value)}
                disabled={!formData.shipId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {availableComponents.map((component) => (
                    <SelectItem key={component.id} value={component.id}>
                      {component.name} ({component.serialNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter job description"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Routine Maintenance">Routine Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedEngineerId">Assigned Engineer *</Label>
              <Select value={formData.assignedEngineerId} onValueChange={(value) => handleChange('assignedEngineerId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engineer" />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((engineer) => (
                    <SelectItem key={engineer.id} value={engineer.id}>
                      {engineer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleChange('scheduledDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => handleChange('estimatedHours', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          
          {formData.status === 'Completed' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actualHours">Actual Hours</Label>
                <Input
                  id="actualHours"
                  type="number"
                  value={formData.actualHours}
                  onChange={(e) => handleChange('actualHours', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="completedDate">Completed Date</Label>
                <Input
                  id="completedDate"
                  type="date"
                  value={formData.completedDate}
                  onChange={(e) => handleChange('completedDate', e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {job ? 'Update Job' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
