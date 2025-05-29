
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageUtils, Component } from '../utils/localStorageUtils';

interface ComponentsContextType {
  components: Component[];
  addComponent: (component: Omit<Component, 'id'>) => void;
  updateComponent: (id: string, component: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  getComponentById: (id: string) => Component | undefined;
  getComponentsByShipId: (shipId: string) => Component[];
  refreshComponents: () => void;
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

export const useComponents = () => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
};

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>([]);

  const refreshComponents = () => {
    const savedComponents = localStorageUtils.getComponents();
    setComponents(savedComponents);
  };

  useEffect(() => {
    refreshComponents();
  }, []);

  const addComponent = (componentData: Omit<Component, 'id'>) => {
    const newComponent: Component = {
      ...componentData,
      id: `c${Date.now()}`
    };
    localStorageUtils.addComponent(newComponent);
    refreshComponents();
  };

  const updateComponent = (id: string, componentData: Partial<Component>) => {
    localStorageUtils.updateComponent(id, componentData);
    refreshComponents();
  };

  const deleteComponent = (id: string) => {
    localStorageUtils.deleteComponent(id);
    refreshComponents();
  };

  const getComponentById = (id: string) => {
    return components.find(component => component.id === id);
  };

  const getComponentsByShipId = (shipId: string) => {
    return components.filter(component => component.shipId === shipId);
  };

  return (
    <ComponentsContext.Provider value={{
      components,
      addComponent,
      updateComponent,
      deleteComponent,
      getComponentById,
      getComponentsByShipId,
      refreshComponents
    }}>
      {children}
    </ComponentsContext.Provider>
  );
};
