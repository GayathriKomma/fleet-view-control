
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';
import { canPerformAction } from '../utils/roleUtils';
import { format } from 'date-fns';
import ComponentForm from '../components/Components/ComponentForm';

const ShipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getShipById } = useShips();
  const { getComponentsByShipId } = useComponents();
  const { getJobsByShipId } = useJobs();
  const { user } = useAuth();
  const [showComponentForm, setShowComponentForm] = useState(false);

  const ship = id ? getShipById(id) : null;
  const components = id ? getComponentsByShipId(id) : [];
  const jobs = id ? getJobsByShipId(id) : [];

  if (!ship) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900">Ship not found</h1>
        <Link to="/ships">
          <Button className="mt-4">Back to Ships</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Decommissioned':
        return 'bg-red-100 text-red-800';
      case 'Maintenance Required':
        return 'bg-red-100 text-red-800';
      case 'Out of Service':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/ships">
            <Button variant="outline" size="sm" className="mb-2">
              ← Back to Ships
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{ship.name}</h1>
          <p className="text-gray-600">IMO: {ship.imo}</p>
        </div>
        <Badge className={getStatusColor(ship.status)}>
          {ship.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ship Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">IMO Number</p>
              <p className="text-lg">{ship.imo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Flag</p>
              <p className="text-lg">{ship.flag}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Registration Date</p>
              <p className="text-lg">
                {ship.registrationDate ? format(new Date(ship.registrationDate), 'PP') : 'N/A'}
              </p>
            </div>
            {ship.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-lg">{ship.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{components.length}</div>
            <p className="text-sm text-gray-600">
              {components.filter(c => c.status === 'Maintenance Required').length} require maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(j => j.status !== 'Completed').length}
            </div>
            <p className="text-sm text-gray-600">
              {jobs.filter(j => j.status === 'Completed').length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="components" className="space-y-4">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="jobs">Maintenance Jobs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ship Components</CardTitle>
                <CardDescription>
                  Manage components installed on this ship
                </CardDescription>
              </div>
              {canPerformAction(user?.role || 'Engineer', 'create_component') && (
                <Button onClick={() => setShowComponentForm(true)}>
                  Add Component
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Installation Date</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell className="font-medium">{component.name}</TableCell>
                      <TableCell>{component.serialNumber}</TableCell>
                      <TableCell>
                        {format(new Date(component.installDate), 'PP')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(component.lastMaintenanceDate), 'PP')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {components.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No components found for this ship.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Jobs</CardTitle>
              <CardDescription>
                All maintenance jobs for this ship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    const component = components.find(c => c.id === job.componentId);
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.description}</TableCell>
                        <TableCell>{component?.name}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>
                          <Badge variant={job.priority === 'Critical' ? 'destructive' : 'outline'}>
                            {job.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getJobStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(job.scheduledDate), 'PP')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {jobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No jobs found for this ship.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>
                Historical maintenance records for this ship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs
                  .filter(job => job.status === 'Completed')
                  .sort((a, b) => new Date(b.completedDate || '').getTime() - new Date(a.completedDate || '').getTime())
                  .map((job) => {
                    const component = components.find(c => c.id === job.componentId);
                    return (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{job.description}</p>
                          <p className="text-sm text-gray-600">
                            {component?.name} - {job.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {job.completedDate ? format(new Date(job.completedDate), 'PP') : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {job.actualHours || job.estimatedHours} hours
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {jobs.filter(job => job.status === 'Completed').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No completed maintenance records found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showComponentForm && (
        <ComponentForm
          shipId={ship.id}
          onClose={() => setShowComponentForm(false)}
          onSave={() => setShowComponentForm(false)}
        />
      )}
    </div>
  );
};

export default ShipDetailPage;
