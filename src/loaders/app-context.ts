import { createContext, useContext } from 'react';
import { FeatureFlagsType, SettingsType, UserType } from 'src/api';
import { AlertType } from 'src/components';

export interface IAppContextType {
  alerts: AlertType[];
  featureFlags: FeatureFlagsType;
  hasPermission: (name: string) => boolean;
  queueAlert: (alert: AlertType) => void;
  selectedRepo?: string;
  setAlerts: (alerts: AlertType[]) => void;
  setUser: (user: UserType) => void;
  settings: SettingsType;
  updateTitle: (title: string) => void;
  user?: UserType;
}

export const AppContext = createContext<IAppContextType>(undefined);
export const useHubContext = () => useContext(AppContext);
