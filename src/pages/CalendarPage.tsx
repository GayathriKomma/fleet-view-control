
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useJobs } from '../contexts/JobsContext';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const CalendarPage: React.FC = () => {
  const { jobs } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Get jobs for the selected date
  const jobsForSelectedDate = jobs.filter(job => 
    isSameDay(new Date(job.scheduledDate), selectedDate)
  );

  // Get all dates in the current month that have jobs
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const datesWithJobs = daysInMonth.filter(date =>
    jobs.some(job => isSameDay(new Date(job.scheduledDate), date))
  );

  const getJobStatusColor = (status: string) => {
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
        <p className="text-gray-600">Schedule and track maintenance activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {format(viewDate, 'MMMM yyyy')}
              </CardTitle>
              <CardDescription>
                Click on a date to view scheduled jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={viewDate}
                onMonthChange={setViewDate}
                className="rounded-md border"
                modifiers={{
                  hasJobs: datesWithJobs
                }}
                modifiersClassNames={{
                  hasJobs: 'bg-blue-100 text-blue-900 font-semibold'
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Jobs for selected date */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Jobs for {format(selectedDate, 'PP')}
              </CardTitle>
              <CardDescription>
                {jobsForSelectedDate.length} job(s) scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobsForSelectedDate.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No jobs scheduled for this date
                  </p>
                ) : (
                  jobsForSelectedDate.map((job) => {
                    const ship = ships.find(s => s.id === job.shipId);
                    const component = components.find(c => c.id === job.componentId);
                    
                    return (
                      <div key={job.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{job.description}</h4>
                          <Badge className={getPriorityColor(job.priority)} variant="outline">
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Ship:</strong> {ship?.name}</p>
                          <p><strong>Component:</strong> {component?.name}</p>
                          <p><strong>Type:</strong> {job.type}</p>
                          <p><strong>Estimated Hours:</strong> {job.estimatedHours}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getJobStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>
            Summary of jobs scheduled for {format(viewDate, 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {jobs.filter(job => {
                  const jobDate = new Date(job.scheduledDate);
                  return jobDate.getMonth() === viewDate.getMonth() && 
                         jobDate.getFullYear() === viewDate.getFullYear();
                }).length}
              </div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {jobs.filter(job => {
                  const jobDate = new Date(job.scheduledDate);
                  return jobDate.getMonth() === viewDate.getMonth() && 
                         jobDate.getFullYear() === viewDate.getFullYear() &&
                         job.status === 'Open';
                }).length}
              </div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {jobs.filter(job => {
                  const jobDate = new Date(job.scheduledDate);
                  return jobDate.getMonth() === viewDate.getMonth() && 
                         jobDate.getFullYear() === viewDate.getFullYear() &&
                         job.status === 'In Progress';
                }).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {jobs.filter(job => {
                  const jobDate = new Date(job.scheduledDate);
                  return jobDate.getMonth() === viewDate.getMonth() && 
                         jobDate.getFullYear() === viewDate.getFullYear() &&
                         job.status === 'Completed';
                }).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Upcoming jobs */}
          <div className="space-y-3">
            <h4 className="font-medium">Upcoming High Priority Jobs</h4>
            {jobs
              .filter(job => {
                const jobDate = new Date(job.scheduledDate);
                return jobDate >= new Date() && 
                       (job.priority === 'High' || job.priority === 'Critical') &&
                       job.status !== 'Completed';
              })
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .slice(0, 5)
              .map((job) => {
                const ship = ships.find(s => s.id === job.shipId);
                const component = components.find(c => c.id === job.componentId);
                
                return (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{job.description}</p>
                      <p className="text-xs text-gray-600">
                        {ship?.name} - {component?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getPriorityColor(job.priority)} variant="outline">
                        {job.priority}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(job.scheduledDate), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                );
              })}
            {jobs.filter(job => {
              const jobDate = new Date(job.scheduledDate);
              return jobDate >= new Date() && 
                     (job.priority === 'High' || job.priority === 'Critical') &&
                     job.status !== 'Completed';
            }).length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No upcoming high priority jobs
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
