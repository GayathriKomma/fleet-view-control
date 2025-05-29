
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';
import { isAfter, parseISO, format } from 'date-fns';
import { Ship, Settings, Wrench, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { ships } = useShips();
  const { components } = useComponents();
  const { jobs } = useJobs();
  const { user } = useAuth();

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

  const criticalJobs = jobs.filter(job => job.priority === 'Critical' && job.status !== 'Completed').length;
  const highPriorityJobs = jobs.filter(job => job.priority === 'High' && job.status !== 'Completed').length;

  const fleetEfficiency = totalShips > 0 ? Math.round((activeShips / totalShips) * 100) : 0;
  const maintenanceCompliance = totalComponents > 0 ? Math.round(((totalComponents - overdueComponents) / totalComponents) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maritime Operations Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}. Here's your fleet overview.</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Last updated: {format(new Date(), 'PPpp')}</div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Status: Operational
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {(criticalJobs > 0 || overdueComponents > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Immediate Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalJobs > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-700">{criticalJobs} critical maintenance job{criticalJobs > 1 ? 's' : ''} pending</span>
                <Badge variant="destructive">Urgent</Badge>
              </div>
            )}
            {overdueComponents > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-700">{overdueComponents} component{overdueComponents > 1 ? 's' : ''} overdue for maintenance</span>
                <Badge variant="destructive">Overdue</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fleet Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Fleet Status</CardTitle>
            <Ship className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalShips}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-blue-600">
                {activeShips} operational • {shipsUnderMaintenance} in maintenance
              </p>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-blue-600">Fleet Efficiency</span>
                <span className="text-blue-800 font-medium">{fleetEfficiency}%</span>
              </div>
              <Progress value={fleetEfficiency} className="h-2 bg-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Components</CardTitle>
            <Settings className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalComponents}</div>
            <p className="text-xs text-green-600 mt-2">
              {overdueComponents > 0 ? `${overdueComponents} require attention` : 'All systems nominal'}
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-green-600">Maintenance Compliance</span>
                <span className="text-green-800 font-medium">{maintenanceCompliance}%</span>
              </div>
              <Progress value={maintenanceCompliance} className="h-2 bg-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Active Jobs</CardTitle>
            <Wrench className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{openJobs + inProgressJobs}</div>
            <p className="text-xs text-orange-600 mt-2">
              {openJobs} open • {inProgressJobs} in progress
            </p>
            <div className="mt-2 flex items-center text-xs">
              <Clock className="w-3 h-3 mr-1 text-orange-600" />
              <span className="text-orange-600">{highPriorityJobs} high priority</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Completion Rate</CardTitle>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{completedJobs}</div>
            <p className="text-xs text-purple-600 mt-2">
              Jobs completed this period
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-purple-600">Success Rate</span>
                <span className="text-purple-800 font-medium">
                  {totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0} 
                className="h-2 bg-purple-200" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-gray-600" />
              Maintenance Pipeline
            </CardTitle>
            <CardDescription>Current job status distribution across the fleet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Open Jobs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{openJobs}</span>
                  <div className="w-24">
                    <Progress value={totalJobs > 0 ? (openJobs / totalJobs) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{inProgressJobs}</span>
                  <div className="w-24">
                    <Progress value={totalJobs > 0 ? (inProgressJobs / totalJobs) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{completedJobs}</span>
                  <div className="w-24">
                    <Progress value={totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">
                <strong>Total Jobs:</strong> {totalJobs} | <strong>Efficiency:</strong> {totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-gray-600" />
              Priority Overview
            </CardTitle>
            <CardDescription>Active maintenance jobs by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { priority: 'Critical', count: criticalJobs, color: 'bg-red-500', textColor: 'text-red-700' },
                { priority: 'High', count: highPriorityJobs, color: 'bg-orange-500', textColor: 'text-orange-700' },
                { priority: 'Medium', count: jobs.filter(j => j.priority === 'Medium' && j.status !== 'Completed').length, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                { priority: 'Low', count: jobs.filter(j => j.priority === 'Low' && j.status !== 'Completed').length, color: 'bg-green-500', textColor: 'text-green-700' }
              ].map((item) => (
                <div key={item.priority} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                    <span className={`text-sm font-medium ${item.textColor}`}>{item.priority} Priority</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.priority === 'Critical' ? 'destructive' : 'secondary'}>
                      {item.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">
                <strong>Action Required:</strong> {criticalJobs + highPriorityJobs} high-priority jobs need attention
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Maritime Operations</CardTitle>
          <CardDescription>Latest maintenance activities across your fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.slice(0, 6).map((job) => {
              const ship = ships.find(s => s.id === job.shipId);
              const component = components.find(c => c.id === job.componentId);
              
              return (
                <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        job.status === 'Completed' ? 'bg-green-500' :
                        job.status === 'In Progress' ? 'bg-blue-500' :
                        job.priority === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <p className="font-medium text-gray-900">{job.description}</p>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <span><strong>Vessel:</strong> {ship?.name}</span>
                      <span><strong>Component:</strong> {component?.name}</span>
                      <span><strong>Type:</strong> {job.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${
                      job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </Badge>
                    <div className="mt-1 text-xs text-gray-500">
                      {job.priority} • {format(new Date(job.scheduledDate), 'MMM dd')}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {jobs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Ship className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No maintenance activities recorded yet.</p>
                <p className="text-sm mt-1">Start by creating maintenance jobs for your fleet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
