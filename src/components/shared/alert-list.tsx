import {
  Alert,
  AlertActionCloseButton,
  AlertProps,
} from '@patternfly/react-core';
import React, { ReactNode } from 'react';

interface IProps {
  /** List of alerts to display */
  alerts: AlertType[];

  /** Callback to close the alert at the given index */
  closeAlert: (alertIndex) => void;
}

export class AlertType {
  id?: string;
  variant: AlertProps['variant'];
  title: string | ReactNode;
  description?: string | ReactNode;
}

export const AlertList = ({ alerts, closeAlert }: IProps) => (
  <div
    style={{
      position: 'fixed',
      right: '5px',
      top: IS_INSIGHTS
        ? '124px' // 70 + 50 + 4
        : '80px', // 76 + 4
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
    }}
    data-cy='AlertList'
  >
    {alerts.map((alert, i) => (
      <Alert
        style={{ marginBottom: '16px' }}
        key={i}
        title={alert.title}
        variant={alert.variant}
        actionClose={<AlertActionCloseButton onClose={() => closeAlert(i)} />}
      >
        {alert.description}
      </Alert>
    ))}
  </div>
);

export function closeAlert(alertIndex, { alerts, setAlerts }) {
  const newList = [...alerts];
  newList.splice(alertIndex, 1);
  setAlerts(newList);
}

export function closeAlertMixin(alertStateVariable) {
  return function (alertIndex) {
    closeAlert(alertIndex, {
      alerts: this.state[alertStateVariable],
      setAlerts: (newList) => this.setState({ [alertStateVariable]: newList }),
    });
  };
}
