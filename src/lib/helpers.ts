import type { Machine } from "./types/database";

export function getDateAndTime(dateString: string | null) {
    if (!dateString) return '-';
    let date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function getTotalHours(machine: Machine) {
    let total = 0;
    machine.prints.map(p => total += (new Date(p.done_at).getTime() - new Date(p.created_at).getTime()) / 1000 / 60 / 60);
    return total;
}

export function getAverageJobDuration(machine: Machine) {
    return (getTotalHours(machine) / machine.prints.length) || 0;
}

export function getTotalExtrudedInKg(machine: Machine) {
    let total = 0;
    machine.prints.map(p => total += p.filament);
    // returns kg
    return total / 1000;
}

export function getSuccessRate(machine: Machine) {
    return (machine.prints.filter(p => p.cancelled === true).length || 1) / (machine.prints.length || 1) * 100;
}