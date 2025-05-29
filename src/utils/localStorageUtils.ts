
export interface UserWithPassword {
  id: string;
  email: string;
  password: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  name: string;
}

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  name: string;
}

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Decommissioned';
  registrationDate: string;
  description?: string;
}

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  status: 'Active' | 'Maintenance Required' | 'Out of Service';
  description?: string;
}

export interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Routine Maintenance';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description: string;
  estimatedHours: number;
  actualHours?: number;
  createdDate: string;
}

export interface Notification {
  id: string;
  type: 'job_created' | 'job_updated' | 'job_completed' | 'maintenance_due';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
}

const STORAGE_KEYS = {
  USERS: 'ship_maintenance_users',
  SHIPS: 'ship_maintenance_ships',
  COMPONENTS: 'ship_maintenance_components',
  JOBS: 'ship_maintenance_jobs',
  NOTIFICATIONS: 'ship_maintenance_notifications',
  CURRENT_USER: 'ship_maintenance_current_user'
};

// Initialize mock data
const initializeMockData = () => {
  const mockUsers: UserWithPassword[] = [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123", name: "John Admin" },
    { id: "2", role: "Inspector", email: "inspector@entnt.in", password: "inspect123", name: "Jane Inspector" },
    { id: "3", role: "Engineer", email: "engineer@entnt.in", password: "engine123", name: "Bob Engineer" }
  ];

  const mockShips: Ship[] = [
    { 
      id: "s1", 
      name: "Ever Given", 
      imo: "9811000", 
      flag: "Panama", 
      status: "Active",
      registrationDate: "2020-01-01",
      description: "Large container vessel"
    },
    { 
      id: "s2", 
      name: "Maersk Alabama", 
      imo: "9164263", 
      flag: "USA", 
      status: "Under Maintenance",
      registrationDate: "2019-06-15",
      description: "Cargo container ship"
    },
    { 
      id: "s3", 
      name: "MSC Oscar", 
      imo: "9703291", 
      flag: "Panama", 
      status: "Active",
      registrationDate: "2021-03-20",
      description: "Ultra large container vessel"
    }
  ];

  const mockComponents: Component[] = [
    { 
      id: "c1", 
      shipId: "s1", 
      name: "Main Engine", 
      serialNumber: "ME-1234",
      installDate: "2020-01-10", 
      lastMaintenanceDate: "2024-03-12",
      nextMaintenanceDate: "2024-09-12",
      status: "Active",
      description: "Primary propulsion engine"
    },
    { 
      id: "c2", 
      shipId: "s2", 
      name: "Radar", 
      serialNumber: "RAD-5678", 
      installDate: "2021-07-18", 
      lastMaintenanceDate: "2023-12-01",
      nextMaintenanceDate: "2024-06-01",
      status: "Maintenance Required",
      description: "Navigation radar system"
    },
    { 
      id: "c3", 
      shipId: "s1", 
      name: "Generator", 
      serialNumber: "GEN-9012", 
      installDate: "2020-02-05", 
      lastMaintenanceDate: "2024-04-20",
      nextMaintenanceDate: "2024-10-20",
      status: "Active",
      description: "Auxiliary power generator"
    },
    { 
      id: "c4", 
      shipId: "s3", 
      name: "Crane", 
      serialNumber: "CR-3456", 
      installDate: "2021-03-25", 
      lastMaintenanceDate: "2024-01-15",
      nextMaintenanceDate: "2024-07-15",
      status: "Active",
      description: "Container loading crane"
    }
  ];

  const mockJobs: Job[] = [
    { 
      id: "j1", 
      componentId: "c1", 
      shipId: "s1", 
      type: "Inspection", 
      priority: "High",
      status: "Open", 
      assignedEngineerId: "3", 
      scheduledDate: "2024-06-15",
      description: "Routine engine inspection",
      estimatedHours: 8,
      createdDate: "2024-05-29"
    },
    { 
      id: "j2", 
      componentId: "c2", 
      shipId: "s2", 
      type: "Repair", 
      priority: "Critical",
      status: "In Progress", 
      assignedEngineerId: "3", 
      scheduledDate: "2024-06-01",
      description: "Radar calibration and repair",
      estimatedHours: 12,
      createdDate: "2024-05-25"
    },
    { 
      id: "j3", 
      componentId: "c3", 
      shipId: "s1", 
      type: "Routine Maintenance", 
      priority: "Medium",
      status: "Completed", 
      assignedEngineerId: "3", 
      scheduledDate: "2024-05-20",
      completedDate: "2024-05-20",
      description: "Generator maintenance and oil change",
      estimatedHours: 6,
      actualHours: 5,
      createdDate: "2024-05-15"
    }
  ];

  // Only initialize if data doesn't exist
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHIPS)) {
    localStorage.setItem(STORAGE_KEYS.SHIPS, JSON.stringify(mockShips));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMPONENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(mockComponents));
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(mockJobs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

initializeMockData();

export const localStorageUtils = {
  // Users
  getUsers: (): UserWithPassword[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Ships
  getShips: (): Ship[] => {
    const ships = localStorage.getItem(STORAGE_KEYS.SHIPS);
    return ships ? JSON.parse(ships) : [];
  },

  saveShips: (ships: Ship[]) => {
    localStorage.setItem(STORAGE_KEYS.SHIPS, JSON.stringify(ships));
  },

  addShip: (ship: Ship) => {
    const ships = localStorageUtils.getShips();
    ships.push(ship);
    localStorageUtils.saveShips(ships);
  },

  updateShip: (shipId: string, updatedShip: Partial<Ship>) => {
    const ships = localStorageUtils.getShips();
    const index = ships.findIndex(s => s.id === shipId);
    if (index !== -1) {
      ships[index] = { ...ships[index], ...updatedShip };
      localStorageUtils.saveShips(ships);
    }
  },

  deleteShip: (shipId: string) => {
    const ships = localStorageUtils.getShips();
    const filteredShips = ships.filter(s => s.id !== shipId);
    localStorageUtils.saveShips(filteredShips);
  },

  // Components
  getComponents: (): Component[] => {
    const components = localStorage.getItem(STORAGE_KEYS.COMPONENTS);
    return components ? JSON.parse(components) : [];
  },

  saveComponents: (components: Component[]) => {
    localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(components));
  },

  addComponent: (component: Component) => {
    const components = localStorageUtils.getComponents();
    components.push(component);
    localStorageUtils.saveComponents(components);
  },

  updateComponent: (componentId: string, updatedComponent: Partial<Component>) => {
    const components = localStorageUtils.getComponents();
    const index = components.findIndex(c => c.id === componentId);
    if (index !== -1) {
      components[index] = { ...components[index], ...updatedComponent };
      localStorageUtils.saveComponents(components);
    }
  },

  deleteComponent: (componentId: string) => {
    const components = localStorageUtils.getComponents();
    const filteredComponents = components.filter(c => c.id !== componentId);
    localStorageUtils.saveComponents(filteredComponents);
  },

  // Jobs
  getJobs: (): Job[] => {
    const jobs = localStorage.getItem(STORAGE_KEYS.JOBS);
    return jobs ? JSON.parse(jobs) : [];
  },

  saveJobs: (jobs: Job[]) => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  addJob: (job: Job) => {
    const jobs = localStorageUtils.getJobs();
    jobs.push(job);
    localStorageUtils.saveJobs(jobs);
  },

  updateJob: (jobId: string, updatedJob: Partial<Job>) => {
    const jobs = localStorageUtils.getJobs();
    const index = jobs.findIndex(j => j.id === jobId);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updatedJob };
      localStorageUtils.saveJobs(jobs);
    }
  },

  deleteJob: (jobId: string) => {
    const jobs = localStorageUtils.getJobs();
    const filteredJobs = jobs.filter(j => j.id !== jobId);
    localStorageUtils.saveJobs(filteredJobs);
  },

  // Notifications
  getNotifications: (): Notification[] => {
    const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return notifications ? JSON.parse(notifications) : [];
  },

  saveNotifications: (notifications: Notification[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  addNotification: (notification: Notification) => {
    const notifications = localStorageUtils.getNotifications();
    notifications.unshift(notification);
    localStorageUtils.saveNotifications(notifications);
  },

  markNotificationAsRead: (notificationId: string) => {
    const notifications = localStorageUtils.getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications[index].read = true;
      localStorageUtils.saveNotifications(notifications);
    }
  }
};
