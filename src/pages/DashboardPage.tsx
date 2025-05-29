
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { isAfter, parseISO } from 'date-fns';

const DashboardPage: React.FC = () => {
  const { ships } = useShips();
  const { components } = useComponents();
  const { jobs } = useJobs();

  // Calculate KPIs
  const totalShips = ships.length;
  const activeShips = ships.filter(ship => ship.status === 'Active').length;
  const shipsUnderMaintenance = ships.filter(ship => ship.status === 'Under Maintenance').length;

  const totalComponents = components.length;
  const overdueComponents = components.filter(component => {
    return isAfter(new Date(), parseISO(component.nextMaintenanceDate));
  }).length;

  const totalJobs = jobs.length;
  const openJobs = jobs.filter(job => job.status === 'Open').length;
  const inProgressJobs = jobs.filter(job => job.status === 'In Progress').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;

  const jobsByPriority = {
    Critical: jobs.filter(job => job.priority === 'Critical' && job.status !== 'Completed').length,
    High: jobs.filter(job => job.priority === 'High' && job.status !== 'Completed').length,
    Medium: jobs.filter(job => job.priority === 'Medium' && job.status !== 'Completed').length,
    Low: jobs.filter(job => job.priority === 'Low' && job.status !== 'Completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your ship maintenance operations</p>
      </div>

      {/* Ships Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ships</CardTitle>
            <span className="text-2xl">🚢</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShips}</div>
            <p className="text-xs text-muted-foreground">
              {activeShips} active, {shipsUnderMaintenance} under maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components</CardTitle>
            <span className="text-2xl">⚙️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComponents}</div>
            <p className="text-xs text-muted-foreground">
              {overdueComponents} overdue for maintenance
            </p>
            {overdueComponents > 0 && (
              <div className="mt-2">
                <Progress value={(overdueComponents / totalComponents) * 100} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <span className="text-2xl">🔧</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openJobs + inProgressJobs}</div>
            <p className="text-xs text-muted-foreground">
              {openJobs} open, {inProgressJobs} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
            <CardDescription>Current status of all maintenance jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Open</span>
              <span className="text-sm text-gray-600">{openJobs}</span>
            </div>
            <Progress value={(openJobs / totalJobs) * 100} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">In Progress</span>
              <span className="text-sm text-gray-600">{inProgressJobs}</span>
            </div>
            <Progress value={(inProgressJobs / totalJobs) * 100} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completed</span>
              <span className="text-sm text-gray-600">{completedJobs}</span>
            </div>
            <Progress value={(completedJobs / totalJobs) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Active jobs by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600">Critical</span>
              <span className="text-sm text-gray-600">{jobsByPriority.Critical}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-600">High</span>
              <span className="text-sm text-gray-600">{jobsByPriority.High}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-600">Medium</span>
              <span className="text-sm text-gray-600">{jobsByPriority.Medium}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">Low</span>
              <span className="text-sm text-gray-600">{jobsByPriority.Low}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>Latest maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job) => {
              const ship = ships.find(s => s.id === job.shipId);
              const component = components.find(c => c.id === job.componentId);
              
              return (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{job.description}</p>
                    <p className="text-sm text-gray-600">
                      {ship?.name} - {component?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{job.priority} Priority</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
