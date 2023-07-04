import { writable } from "svelte/store";

export enum AlertTypeOld {
    INFO,
    URGENT,
    ERROR
}

export const alerts = writable<{ id: string, header: string, message: string, type: AlertTypeOld }[]>([]);

export const addAlert = (type: AlertTypeOld, header: string, message: string) => {
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

export function getAlertStyling(type: AlertTypeOld) {
    switch (type) {
        case AlertTypeOld.INFO:
            return 'bg-info text-info-content';
            break;
        case AlertTypeOld.URGENT:
            return 'bg-warning text-warning-content';
            break;
        case AlertTypeOld.ERROR:
        default:
            return 'bg-error text-error-content';
            break;
    }
}