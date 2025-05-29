
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useJobs } from '../contexts/JobsContext';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useAuth } from '../contexts/AuthContext';
import { canPerformAction } from '../utils/roleUtils';
import { format } from 'date-fns';
import JobForm from '../components/Jobs/JobForm';

const JobsPage: React.FC = () => {
  const { jobs } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter(job => {
    const ship = ships.find(s => s.id === job.shipId);
    const component = components.find(c => c.id === job.componentId);
    
    const matchesSearch = 
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Open':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Jobs</h1>
          <p className="text-gray-600">Manage and track maintenance activities</p>
        </div>
        {canPerformAction(user?.role || 'Engineer', 'create_job') && (
          <Button onClick={() => {
            setSelectedJob(null);
            setShowForm(true);
          }}>
            Create New Job
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jobs Overview</CardTitle>
          <CardDescription>
            {jobs.length} total jobs in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search jobs, ships, or components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Ship</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => {
                  const ship = ships.find(s => s.id === job.shipId);
                  const component = components.find(c => c.id === job.componentId);
                  
                  return (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {job.description}
                      </TableCell>
                      <TableCell>{ship?.name}</TableCell>
                      <TableCell>{component?.name}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(job.scheduledDate), 'PP')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {canPerformAction(user?.role || 'Engineer', 'edit_job') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowForm(true);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No jobs found matching your filters.'
                : 'No jobs found.'}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <JobForm
          job={selectedJob}
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default JobsPage;
