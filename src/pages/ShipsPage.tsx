
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../contexts/AuthContext';
import { canPerformAction } from '../utils/roleUtils';
import { Link } from 'react-router-dom';
import ShipForm from '../components/Ships/ShipForm';

const ShipsPage: React.FC = () => {
  const { ships } = useShips();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  const filteredShips = ships.filter(ship =>
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.imo.includes(searchTerm) ||
    ship.flag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Decommissioned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ships</h1>
          <p className="text-gray-600">Manage your fleet of ships</p>
        </div>
        {canPerformAction(user?.role || 'Engineer', 'create_ship') && (
          <Button onClick={() => {
            setSelectedShip(null);
            setShowForm(true);
          }}>
            Add New Ship
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
          <CardDescription>
            {ships.length} ships in your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search ships by name, IMO, or flag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>IMO Number</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShips.map((ship) => (
                <TableRow key={ship.id}>
                  <TableCell className="font-medium">{ship.name}</TableCell>
                  <TableCell>{ship.imo}</TableCell>
                  <TableCell>{ship.flag}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ship.status)}>
                      {ship.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/ships/${ship.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {canPerformAction(user?.role || 'Engineer', 'edit_ship') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShip(ship);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredShips.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No ships found matching your search.' : 'No ships found.'}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <ShipForm
          ship={selectedShip}
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ShipsPage;
