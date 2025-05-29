
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
import { useComponents } from '../../contexts/ComponentsContext';
import { Component } from '../../utils/localStorageUtils';
import { toast } from "sonner";
import { addMonths, format } from 'date-fns';

interface ComponentFormProps {
  component?: Component | null;
  shipId?: string;
  onClose: () => void;
  onSave: () => void;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ component, shipId, onClose, onSave }) => {
  const { addComponent, updateComponent } = useComponents();
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    status: 'Active' as Component['status'],
    description: ''
  });

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name,
        serialNumber: component.serialNumber,
        installDate: component.installDate,
        lastMaintenanceDate: component.lastMaintenanceDate,
        nextMaintenanceDate: component.nextMaintenanceDate,
        status: component.status,
        description: component.description || ''
      });
    } else {
      // Set default dates for new components
      const today = new Date();
      setFormData(prev => ({
        ...prev,
        installDate: format(today, 'yyyy-MM-dd'),
        lastMaintenanceDate: format(today, 'yyyy-MM-dd'),
        nextMaintenanceDate: format(addMonths(today, 6), 'yyyy-MM-dd')
      }));
    }
  }, [component]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.serialNumber || !shipId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (component) {
        updateComponent(component.id, formData);
        toast.success('Component updated successfully');
      } else {
        addComponent({ ...formData, shipId });
        toast.success('Component created successfully');
      }
      onSave();
    } catch (error) {
      toast.error('Error saving component');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{component ? 'Edit Component' : 'Add New Component'}</DialogTitle>
          <DialogDescription>
            {component ? 'Update component information' : 'Enter component details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Component Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter component name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number *</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              placeholder="Enter serial number"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="installDate">Installation Date</Label>
            <Input
              id="installDate"
              type="date"
              value={formData.installDate}
              onChange={(e) => handleChange('installDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
            <Input
              id="lastMaintenanceDate"
              type="date"
              value={formData.lastMaintenanceDate}
              onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
            <Input
              id="nextMaintenanceDate"
              type="date"
              value={formData.nextMaintenanceDate}
              onChange={(e) => handleChange('nextMaintenanceDate', e.target.value)}
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
                <SelectItem value="Maintenance Required">Maintenance Required</SelectItem>
                <SelectItem value="Out of Service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter component description"
              rows={3}
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {component ? 'Update Component' : 'Add Component'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentForm;
