<script lang="ts">
  import { addDays, addMonths, differenceInCalendarDays, differenceInDays, format, getDate, getDay, getDaysInMonth, getMonth, getWeek, getWeekOfMonth, isBefore, isSameMonth, isThisMonth, isThisWeek, isToday, isWeekend, lastDayOfMonth, lastDayOfWeek, setDate, setDay, startOfWeek } from 'date-fns';
	import { ChevronLeft, ChevronRight } from 'svelte-heros-v2';
	import NewMaintMenu from './menu/NewMaintMenu.svelte';

  let selectedMonth = setDate(new Date(), 1);

  $: if (selectedMonth) {
    firstCalendarDay = setDay(selectedMonth, 0);
    lastCalendarDay = lastDayOfWeek(lastDayOfMonth(selectedMonth));
    totalCalendarDays = differenceInCalendarDays(lastCalendarDay, firstCalendarDay);
  }

  let firstCalendarDay = setDay(selectedMonth, 0);
  let lastCalendarDay = lastDayOfWeek(lastDayOfMonth(selectedMonth));
  let totalCalendarDays = differenceInCalendarDays(lastCalendarDay, firstCalendarDay);

  function getBorderStyle(date: Date) {
    let style = '';
    
    if (isToday(date))
      style += 'bg-gradient-to-t from-primary via-primary bg-primary';
    else if (!isSameMonth(selectedMonth, date))
      style += 'bg-gradient-to-t from-neutral via-neutral bg-base-100';
    else
      style += 'bg-gradient-to-t from-gray-500 via-gray-500 bg-base-100';

    return style;
  }

  function getWeekendStyle(date: Date) {
    if (isWeekend(date))
      if (getDay(date) === 0)
        return ' mr-16';
      else
        return ' ml-16'
  }

  function getTextStyle(date: Date) {
    if (!isSameMonth(selectedMonth, date))
      return 'text-base-content/25';
    else
      return 'text-base-content';
  }

  function getEvents(date: Date) {
    let events: { name: string, type: 'monthly' | 'weekly' }[] = [];

    if (isWeekend(date)) return [];

    const weekNum = getWeek(date);
    if (weekNum > 23)
      events.push({
        name: `Weekly PM ${weekNum}`,
        type: 'weekly'
      });

    const monthNum = getMonth(date);
    if (monthNum > 4)
      events.push({
        name: `Monthly PM ${getMonth(date) + 1}`,
        type: 'monthly'
      })

    return events;
  }

  function getEventStyle(date: Date, type: 'weekly' | 'monthly') {
    if (type === 'weekly')
      if (isThisWeek(date))
        return 'bg-warning text-warning-content';
      else if (isBefore(date, new Date()))
        return 'bg-error text-error-content';
      else
        return 'bg-success text-success-content';
    else
      if (isThisMonth(date))
        return 'bg-warning text-warning-content';
      else if (isBefore(date, new Date()))
        return 'bg-error text-error-content';
      else
        return 'bg-success text-success-content';
  }
</script>

<div class="flex flex-row justify-center items-end gap-8 w-full pb-8 select-none">
  <div class="flex flex-row justify-center items-center gap-8">
    <div class="btn btn-square btn-ghost" on:click={() => selectedMonth = addMonths(selectedMonth, -1)}>
      <ChevronLeft size={'32px'} />
    </div>
    <div class="text-6xl font-thin w-72 text-center">{format(selectedMonth, 'LLL yyyy')}</div>
    <div class="btn btn-square btn-ghost" on:click={() => selectedMonth = addMonths(selectedMonth, 1)}>
      <ChevronRight size={'32px'} />
    </div>
  </div>
</div>

<div class="w-[95%] mx-auto grid grid-cols-7 justify-items-center text-xl font-thin select-none">
  <div class="mr-16">Sunday</div><div>Monday</div><div>Tuesday</div><div>Wednesday</div><div>Thursday</div><div>Friday</div><div class="ml-16">Saturday</div>

  {#each {length: totalCalendarDays + 1} as _, i}
    <div class="w-full aspect-square p-1 {getWeekendStyle(addDays(firstCalendarDay, i))}">
      <div class="w-full aspect-square rounded-xl flex item-center justify-center p-0.5 shadow-lg shadow-base-300 {getBorderStyle(addDays(firstCalendarDay, i))}">
        <div class="relative aspect-square rounded-xl bg-base-100">
          <div class="text-end p-1 px-2 font-light {getTextStyle(addDays(firstCalendarDay, i))}">{getDate(addDays(firstCalendarDay, i))}</div>
        
          <!-- Events -->
          <div class="absolute top-9 left-0 w-full flex flex-col gap-1">
            {#each getEvents(addDays(firstCalendarDay, i)) as event}
              <NewMaintMenu event={event} eventStyles={getEventStyle(addDays(firstCalendarDay, i), event.type)}>
                <div class="cursor-pointer hover:opacity-100 opacity-75 transition text-xs text-center font-bold {getEventStyle(addDays(firstCalendarDay, i), event.type)}">{event.name}</div>
              </NewMaintMenu>
            {/each}
          </div> 
        </div>
      </div>
    </div>
  {/each}
</div>

<div class="w-full flex flex-row justify-end items-center my-8">
  <div class="font-light mr-2">Legend</div>
  <div class="bg-error/80 text-error-content text-xs font-mono rounded rounded-r-none uppercase px-2 py-1">Overdue</div>
  <div class="bg-warning/80 text-warning-content text-xs font-mono uppercase px-2 py-1">Current</div>
  <div class="bg-success/80 text-success-content text-xs font-mono rounded rounded-l-none uppercase px-2 py-1">Upcoming</div>
</div>