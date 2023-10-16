import type { Database } from "./supabase";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type Fault = Tables<'faults'> & {
    created_by: Tables<'profiles'>,
    resolved_by: Tables<'profiles'> | null
};

export type Print = Tables<'prints'> & {
    created_by: Tables<'profiles'>,
    canceled_by: Tables<'profiles'> | null
};

export type Machine = Tables<'machines'> & {
    machine_def: Tables<'machine_defs'>
    faults: Fault[],
    prints: Print[]
}

export type User = Tables<'profiles'> & {
    perms: Tables<'user_levels'>
}

export type UserLevel = Tables<'user_levels'>;

export type InventoryItem = Tables<'inv_items'> & {
    changes: InventoryChange[],
    created_by: Tables<'profiles'>,
    inv_category: Tables<'inv_categories'>
}

export type InventoryChange = Tables<'inv_changes'> & {
    created_by: Tables<'profiles'>,
    running_total: number // this is calculated client side
}

export type InventoryCategory = Tables<'inv_categories'>;

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
    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.canceled);

    if (activeFaults.length > 0)
        return MachineStatus.FAULT;
    else if (activePrints.length > 0)
        return MachineStatus.PRINTING;
    else
        return MachineStatus.IDLE;
}

export function getMachineStatusColor(machine: Machine) {
    let activeFaults = machine.faults.filter(f => !f.resolved);
    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.canceled);

    if (activeFaults.length > 0)
        return 'text-warning'
    else if (activePrints.length > 0)
        return 'text-info';
    else
        return 'text-base-content/75';
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
    let previousPrints = machine.prints.filter(p => new Date(p.done_at).getTime() < Date.now() || p.canceled)
        .sort((a, b) => {
            return new Date(a.canceled ? a.canceled_at! : a.done_at).getTime() - new Date(b.canceled ? b.canceled_at! : b.done_at).getTime()
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
    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.canceled);
    return activePrints[0];
}

export function getActivePrintJobTimeRemaining(machine: Machine) {
    if (machine === null || machine.prints === null)
        return 0;

    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.canceled);

    if (activePrints.length === 0)
        return 0;

    let currentPrint = activePrints[0];

    return (new Date(currentPrint.done_at).getTime() - Date.now()) / 1000;
}