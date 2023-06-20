import { writable } from "svelte/store";

export enum AlertType {
    INFO,
    URGENT,
    ERROR
}

export const alerts = writable<{ id: string, header: string, message: string, type: AlertType }[]>([]);

export const addAlert = (type: AlertType, header: string, message: string) => {
    const id = Date.now().toString();
    alerts.update(oldAlerts => {
        setTimeout(() => deleteAlertId(id), 10000);
        return oldAlerts.concat({ id, header, message, type });
    });
}

export const deleteAlertId = (id: string) => {
    alerts.update(oldAlerts => {
        let index = oldAlerts.findIndex(a => a.id === id);
        if (index !== -1) oldAlerts.splice(index, 1);
        return oldAlerts;
    });
}

export function getAlertStyling(type: AlertType) {
    switch (type) {
        case AlertType.INFO:
            return 'bg-info text-info-content';
            break;
        case AlertType.URGENT:
            return 'bg-warning text-warning-content';
            break;
        case AlertType.ERROR:
        default:
            return 'bg-error text-error-content';
            break;
    }
}