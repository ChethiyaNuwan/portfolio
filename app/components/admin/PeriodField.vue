<script setup lang="ts">
// Start and end dates for an experience entry: year and month pickers, a "present" switch for a role that is still
// going, and a switch to hide the months (the public site and the git tree then use whole years).
interface Period {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  present: boolean;
  showMonth: boolean;
}
const props = defineProps<{ item: Period }>();
// the parent owns the entry; its fields are edited in place
const item = toRef(props, "item");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const thisYear = new Date().getFullYear();
const years = computed(() => {
  const lo = Math.min(1990, item.value.startYear, item.value.endYear);
  return Array.from({ length: thisYear + 1 - lo + 1 }, (_, i) => thisYear + 1 - i);
});

const set = <K extends keyof Period>(k: K, v: Period[K]) => {
  item.value[k] = v;
};
const num = (e: Event) => Number((e.target as HTMLSelectElement).value);

const text = computed(() => {
  const p = item.value;
  const side = (y: number, m: number) => (p.showMonth && m ? `${MONTHS[m - 1]} ${y}` : String(y));
  return p.present ? `${side(p.startYear, p.startMonth)} - Present` : `${side(p.startYear, p.startMonth)} - ${side(p.endYear, p.endMonth)}`;
});
const backwards = computed(() => !item.value.present && (item.value.endYear * 12 + item.value.endMonth < item.value.startYear * 12 + item.value.startMonth));
</script>

<template>
  <fieldset class="grid gap-3 rounded-lg border border-default p-3">
    <legend class="px-1 text-sm text-muted">Dates</legend>
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="flex flex-col gap-1">
        <span class="text-sm text-muted">From</span>
        <div class="flex gap-2">
          <select class="admin-input" :value="item.startYear" aria-label="Start year" @change="set('startYear', num($event))">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <select v-if="item.showMonth" class="admin-input" :value="item.startMonth" aria-label="Start month" @change="set('startMonth', num($event))">
            <option :value="0">Month</option>
            <option v-for="(m, i) in MONTHS" :key="m" :value="i + 1">{{ m }}</option>
          </select>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-sm text-muted">To</span>
        <p v-if="item.present" class="admin-input flex items-center text-muted">Present</p>
        <div v-else class="flex gap-2">
          <select class="admin-input" :value="item.endYear" aria-label="End year" @change="set('endYear', num($event))">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <select v-if="item.showMonth" class="admin-input" :value="item.endMonth" aria-label="End month" @change="set('endMonth', num($event))">
            <option :value="0">Month</option>
            <option v-for="(m, i) in MONTHS" :key="m" :value="i + 1">{{ m }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" :checked="item.present" @change="set('present', ($event.target as HTMLInputElement).checked)" /> Still working here (present)</label>
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" :checked="item.showMonth" @change="set('showMonth', ($event.target as HTMLInputElement).checked)" /> Show months</label>
    </div>
    <p class="text-sm text-muted">Shown as <strong class="text-toned">{{ text }}</strong>. The git tree on the site follows these dates{{ item.showMonth ? " to the month" : ", by whole years" }}.</p>
    <p v-if="backwards" class="text-sm text-red-400">The end date is before the start date.</p>
  </fieldset>
</template>
