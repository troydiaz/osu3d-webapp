import { differenceInDays } from "date-fns";
import type { Machine } from "./types/database";

export function getDateAndTime(dateString: string | null) {
  if (!dateString) return '-';
  let date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function getDaysSince(dateString: string | null) {
  if (!dateString) return '-';
  const days = differenceInDays(new Date(), new Date(dateString));
  if (days === 0) return 'Today';
  return `approx. ${days} ${days === 1 ? 'day': 'days'} ago`;
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
  return (machine.prints.filter(p => p.canceled === true).length || 1) / (machine.prints.length || 1) * 100;
}

export enum PermCategory {
  TIER_1 = 0,
  TIER_2 = 1,
  TIER_3 = 2,
  USERS = 3,
  MACHINES = 4,
  MAINTENANCE = 5,
  INVENTORY = 6,
  SPECIAL = 7
}

export enum PermFlag {
  FIRST,
  SECOND,
  THIRD,
  FOURTH
}

export function getPermCategory(perms: number, category: PermCategory) {
  return (perms >>> 0) >> (4 * (category >>> 0));
}

export function hasPermission(perms: number | null | undefined, category: PermCategory, flag: PermFlag) {
  if (perms === null || perms === undefined) return false;
  return ((getPermCategory(perms, category) & (1 << flag)) > 0) || ((getPermCategory(perms, PermCategory.SPECIAL) & (1 << PermFlag.FIRST)) > 0); // if admin bit is set, always return true
}

export function getPermissionBit(category: PermCategory, flag: PermFlag) {
  return (1 << flag) << (4 * category);
}