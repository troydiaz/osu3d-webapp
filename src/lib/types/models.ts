import { formatDistance, subDays } from "date-fns";
import type { Database } from "./supabase";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Print = Tables<'prints'> & {
    created_by: Tables<'profiles'>
    status: Enums<'print_status'>
}

export type MachineEvent = Tables<'machine_events'> & {
  created_by: Tables<'profiles'> | null
  resolved_by: Tables<'profiles'> | null
  machine?: Machine
  print?: Print
}

export type Machine = Tables<'machines'> & {
    machine_def: Tables<'machine_defs'>
    prints: Print[]
    status: Enums<'machine_status'>
    events: MachineEvent[]
}

export type User = Tables<'profiles'> & {
    perms: Tables<'user_levels'>
}

export type Announcement = Tables<'announcements'> & {
    created_by: Tables<'profiles'>
}

export type Permissions = Tables<'user_levels'>;

export type InventoryItem = Tables<'inv_items'> & {
    changes: InventoryChange[]
    created_by: Tables<'profiles'>
    inv_category: Tables<'inv_categories'>
    current_stock: number
}

export type InventoryChange = Tables<'inv_changes'> & {
    created_by: Tables<'profiles'>
    running_total: number // this is calculated client side
}

export type InventoryCategory = Tables<'inv_categories'>;
export type InventoryLocation = Tables<'inv_locations'>;

export enum MachineStatus {
    UNKNOWN = 'UNKNOWN',
    IDLE = 'IDLE',
    FAULT = 'FAULT',
    WORKING = 'WORKING'
}

export type DashboardMachine = {
    machine_id: string
    tier: number
    make: string
    model: string
    nickname: string
    status: MachineStatus
    print_id: string | null
    print_user_id: string | null,
    done_at: string | null
    full_name: string | null
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
    switch (machine.status) {
        case 'FAULT':
            return MachineStatus.FAULT;
        case 'IDLE':
            return MachineStatus.IDLE;
        case 'WORKING':
            return MachineStatus.WORKING;
        default:
            return MachineStatus.UNKNOWN;
    }
}

export function getMachineStatusColor(status: MachineStatus) {
    switch (status) {
        case 'FAULT':
            return 'text-warning';
        case 'WORKING':
            return 'text-info';
        default:
            return 'text-base-content/75';
    }
}

export function machineStatusToText(status: MachineStatus) {
    switch (status) {
        case MachineStatus.IDLE:
            return 'Idle';
        case MachineStatus.FAULT:
            return 'Down';
        case MachineStatus.WORKING:
            return 'Printing';
        case MachineStatus.UNKNOWN:
        default:
            return 'Unknown';
    }
}

export function getTimeSinceLastCompletePrintJob(machine: Machine) {
    const recentPrint = machine.prints
      .sort((b, a) => {
          return new Date(a.status !== 'SUCCESS' ? a.created_at : a.done_at).getTime() - new Date(b.status !== 'SUCCESS' ? b.created_at : b.done_at).getTime()
      })
      .at(0);

    if (!recentPrint)
      return '-';

    return formatDistance(new Date(recentPrint.status !== 'SUCCESS' ? recentPrint.created_at : recentPrint.done_at), new Date());
}

export function getActivePrintJob(machine: Machine) {
  return machine.prints.find(p => p.status === 'WORKING');
}

export function getTimeUntil(dateString: string | null) {
  if (!dateString || new Date(dateString).getTime() < Date.now()) return 0;
  return Math.ceil((new Date(dateString).getTime() - Date.now()) / 1000);
}