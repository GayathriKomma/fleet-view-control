
export type UserRole = 'Admin' | 'Inspector' | 'Engineer';

export const rolePermissions = {
  Admin: {
    canCreateShips: true,
    canEditShips: true,
    canDeleteShips: true,
    canCreateComponents: true,
    canEditComponents: true,
    canDeleteComponents: true,
    canCreateJobs: true,
    canEditJobs: true,
    canDeleteJobs: true,
    canAssignJobs: true,
    canViewAllData: true,
    canManageUsers: true
  },
  Inspector: {
    canCreateShips: false,
    canEditShips: true,
    canDeleteShips: false,
    canCreateComponents: true,
    canEditComponents: true,
    canDeleteComponents: false,
    canCreateJobs: true,
    canEditJobs: true,
    canDeleteJobs: false,
    canAssignJobs: true,
    canViewAllData: true,
    canManageUsers: false
  },
  Engineer: {
    canCreateShips: false,
    canEditShips: false,
    canDeleteShips: false,
    canCreateComponents: false,
    canEditComponents: false,
    canDeleteComponents: false,
    canCreateJobs: false,
    canEditJobs: true,
    canDeleteJobs: false,
    canAssignJobs: false,
    canViewAllData: true,
    canManageUsers: false
  }
};

export const hasPermission = (userRole: UserRole, permission: keyof typeof rolePermissions.Admin): boolean => {
  return rolePermissions[userRole][permission];
};

export const canPerformAction = (userRole: UserRole, action: string): boolean => {
  switch (action) {
    case 'create_ship':
      return hasPermission(userRole, 'canCreateShips');
    case 'edit_ship':
      return hasPermission(userRole, 'canEditShips');
    case 'delete_ship':
      return hasPermission(userRole, 'canDeleteShips');
    case 'create_component':
      return hasPermission(userRole, 'canCreateComponents');
    case 'edit_component':
      return hasPermission(userRole, 'canEditComponents');
    case 'delete_component':
      return hasPermission(userRole, 'canDeleteComponents');
    case 'create_job':
      return hasPermission(userRole, 'canCreateJobs');
    case 'edit_job':
      return hasPermission(userRole, 'canEditJobs');
    case 'delete_job':
      return hasPermission(userRole, 'canDeleteJobs');
    case 'assign_job':
      return hasPermission(userRole, 'canAssignJobs');
    default:
      return false;
  }
};
