
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageUtils, Ship } from '../utils/localStorageUtils';

interface ShipsContextType {
  ships: Ship[];
  addShip: (ship: Omit<Ship, 'id'>) => void;
  updateShip: (id: string, ship: Partial<Ship>) => void;
  deleteShip: (id: string) => void;
  getShipById: (id: string) => Ship | undefined;
  refreshShips: () => void;
}

const ShipsContext = createContext<ShipsContextType | undefined>(undefined);

export const useShips = () => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
};

export const ShipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);

  const refreshShips = () => {
    const savedShips = localStorageUtils.getShips();
    setShips(savedShips);
  };

  useEffect(() => {
    refreshShips();
  }, []);

  const addShip = (shipData: Omit<Ship, 'id'>) => {
    const newShip: Ship = {
      ...shipData,
      id: `s${Date.now()}`
    };
    localStorageUtils.addShip(newShip);
    refreshShips();
  };

  const updateShip = (id: string, shipData: Partial<Ship>) => {
    localStorageUtils.updateShip(id, shipData);
    refreshShips();
  };

  const deleteShip = (id: string) => {
    localStorageUtils.deleteShip(id);
    refreshShips();
  };

  const getShipById = (id: string) => {
    return ships.find(ship => ship.id === id);
  };

  return (
    <ShipsContext.Provider value={{
      ships,
      addShip,
      updateShip,
      deleteShip,
      getShipById,
      refreshShips
    }}>
      {children}
    </ShipsContext.Provider>
  );
};
