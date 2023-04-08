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

export function machineStatusToText(status: MachineStatus) {
    switch (status) {
        case MachineStatus.IDLE:
            return 'idle';
        case MachineStatus.FAULT:
            return 'fault';
        case MachineStatus.PRINTING:
            return 'printing';
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
    let activePrints = machine.prints.filter(p => new Date(p.done_at).getTime() > Date.now() && !p.cancelled);

    if (activePrints.length === 0)
        return 0;

    let currentPrint = activePrints[0];

    return (new Date(currentPrint.done_at).getTime() - Date.now()) / 1000;
}