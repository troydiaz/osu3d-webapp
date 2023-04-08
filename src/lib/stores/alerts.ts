import { writable } from "svelte/store";

export enum AlertType {
    INFO,
    ERROR
}

export const alerts = writable<{ id: string, message: string, type: AlertType }[]>([]);


export const addAlert = (type: AlertType, message: string) => {
    const id = Date.now().toString();
    alerts.update(oldAlerts => {
        setTimeout(() => deleteAlertId(id), 3000);
        return oldAlerts.concat({ id, message, type });
    });
}

export const deleteAlertId = (id: string) => {
    alerts.update(oldAlerts => {
        let index = oldAlerts.findIndex(a => a.id === id);
        if (index !== -1) oldAlerts.splice(index, 1);
        return oldAlerts;
    });
}