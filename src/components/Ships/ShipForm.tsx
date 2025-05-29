
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
import { useShips } from '../../contexts/ShipsContext';
import { Ship } from '../../utils/localStorageUtils';
import { toast } from "sonner";

interface ShipFormProps {
  ship?: Ship | null;
  onClose: () => void;
  onSave: () => void;
}

const ShipForm: React.FC<ShipFormProps> = ({ ship, onClose, onSave }) => {
  const { addShip, updateShip } = useShips();
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active' as Ship['status'],
    registrationDate: '',
    description: ''
  });

  useEffect(() => {
    if (ship) {
      setFormData({
        name: ship.name,
        imo: ship.imo,
        flag: ship.flag,
        status: ship.status,
        registrationDate: ship.registrationDate,
        description: ship.description || ''
      });
    }
  }, [ship]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.imo || !formData.flag) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (ship) {
        updateShip(ship.id, formData);
        toast.success('Ship updated successfully');
      } else {
        addShip(formData);
        toast.success('Ship created successfully');
      }
      onSave();
    } catch (error) {
      toast.error('Error saving ship');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{ship ? 'Edit Ship' : 'Add New Ship'}</DialogTitle>
          <DialogDescription>
            {ship ? 'Update ship information' : 'Enter ship details to add to your fleet'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ship Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter ship name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imo">IMO Number *</Label>
            <Input
              id="imo"
              value={formData.imo}
              onChange={(e) => handleChange('imo', e.target.value)}
              placeholder="Enter IMO number"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="flag">Flag *</Label>
            <Input
              id="flag"
              value={formData.flag}
              onChange={(e) => handleChange('flag', e.target.value)}
              placeholder="Enter flag state"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="registrationDate">Registration Date</Label>
            <Input
              id="registrationDate"
              type="date"
              value={formData.registrationDate}
              onChange={(e) => handleChange('registrationDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter ship description"
              rows={3}
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {ship ? 'Update Ship' : 'Add Ship'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipForm;
