import type { Database } from "./supabase";

export type Fault = Database['public']['Tables']['fault_log']['Row'] & {
    created_by: Database['public']['Tables']['profiles']['Row'],
    resolved_by: Database['public']['Tables']['profiles']['Row'] | null
};

export type Print = Database['public']['Tables']['print_log']['Row'] & {
    created_by: Database['public']['Tables']['profiles']['Row'],
    cancelled_by: Database['public']['Tables']['profiles']['Row'] | null
};

export type Machine = Database['public']['Tables']['machines']['Row'] & {
    machine_def: Database['public']['Tables']['machine_defs']['Row']
    faults: Fault[],
    prints: Print[]
}

export type User = Database['public']['Tables']['profiles']['Row'] & {
    perms: Database['public']['Tables']['user_levels']['Row']
}

export type UserLevel = Database['public']['Tables']['user_levels']['Row'];

export type InventoryItem = Database['public']['Tables']['inv_items']['Row'] & {
    changes: InventoryChange[],
    created_by: Database['public']['Tables']['profiles']['Row'],
    inv_category: Database['public']['Tables']['inv_categories']['Row']
}

export type InventoryChange = Database['public']['Tables']['inv_changes']['Row'] & {
    created_by: Database['public']['Tables']['profiles']['Row'],
    running_total: number // this is calculated client side
}

export type InventoryCategory = Database['public']['Tables']['inv_categories']['Row'];

export enum MachineStatus {
    UNKNOWN,
    IDLE,
    FAULT,
    PRINTING
}

export interface HMS {
    h: number,
    m: number,
    s: number
}

export function prettyDate(input: string) {
    return new Date(input).toLocaleDateString();
}

export function prettyDateTime(input: string) {
    return new Date(input).toLocaleString();
}

export function totalAllChanges(changes: InventoryChange[] | undefined) {
    if (changes === undefined) return 0;
    let total = 0;
    for (let change of changes) {
        total += change.amount;
    }
    return total;
}

export function getMostRecentChangeDateName(changes: InventoryChange[] | undefined) {
    if (changes === undefined || changes.length === 0) return { name: '-', date: '-' };
    const recent = changes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
    return { name: recent.created_by.full_name, date: new Date(recent.created_at).toLocaleDateString()};
}

export function getMachineStatus(machine: Machine) {
    let activeFaults = machine.faults.filter(f => !f.resolved);
    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.cancelled);

    if (activeFaults.length > 0)
        return MachineStatus.FAULT;
    else if (activePrints.length > 0)
        return MachineStatus.PRINTING;
    else
        return MachineStatus.IDLE;
}

export function getMachineStatusColor(machine: Machine) {
    let activeFaults = machine.faults.filter(f => !f.resolved);
    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.cancelled);

    if (activeFaults.length > 0)
        return 'text-warning'
    else if (activePrints.length > 0)
        return 'text-info';
    else
        return 'text-neutral-content';
}

export function machineStatusToText(status: MachineStatus) {
    switch (status) {
        case MachineStatus.IDLE:
            return 'Idle';
        case MachineStatus.FAULT:
            return 'Down';
        case MachineStatus.PRINTING:
            return 'Printing';
        case MachineStatus.UNKNOWN:
        default:
            return 'Unknown';
    }
}

export function getLatestCompletePrintJob(machine: Machine) {
    let previousPrints = machine.prints.filter(p => new Date(p.done_at).getTime() < Date.now() || p.cancelled)
        .sort((a, b) => {
            return new Date(a.cancelled ? a.cancelled_at! : a.done_at).getTime() - new Date(b.cancelled ? b.cancelled_at! : b.done_at).getTime()
        });

    let timeSince = '-';

    if (previousPrints.length > 0) {
        let elapsedHours = (Date.now() - new Date(previousPrints[0].done_at).getTime()) / 1000 / 60 / 60;

        if (elapsedHours < 0.1)
            timeSince = 'just now';
        else if (elapsedHours < 1)
            timeSince = '< 1 hr ago';
        else
            timeSince = elapsedHours.toFixed(0) + ' hrs ago';
    }

    return timeSince;
}

export function getActivePrintJob(machine: Machine) {
    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.cancelled);
    return activePrints[0];
}

export function getActivePrintJobTimeRemaining(machine: Machine) {
    if (machine === null || machine.prints === null)
        return 0;

    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.cancelled);

    if (activePrints.length === 0)
        return 0;

    let currentPrint = activePrints[0];

    return (new Date(currentPrint.done_at).getTime() - Date.now()) / 1000;
}