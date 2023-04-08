import { writable } from "svelte/store";

export const alerts = writable<{id: string, message: string}[]>([]);


export const addAlert = (message: string) => {
    const id = Date.now().toString();
    alerts.update(oldAlerts => {
        setTimeout(() => deleteAlertId(id), 3000);
        return oldAlerts.concat({id, message });
    });
}

export const deleteAlertId = (id: string) => {
    alerts.update(oldAlerts => {
        let index = oldAlerts.findIndex(a => a.id === id);
        if (index !== -1) oldAlerts.splice(index, 1);
        return oldAlerts;
    });
}