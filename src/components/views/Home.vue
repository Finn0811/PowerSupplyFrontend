<template>
  <div class="mt-3">
    <h1 class="title has-text-left">Stromversorgungen</h1>

    <div style="overflow: hidden">
      <div class="columns is-multiline">

        <div v-if="isPowerSupplyLoading" class="column is-3">
          <div class="notification is-success">
            <p class="title mb-2">
              <b-skeleton size="is-large"></b-skeleton>
            </p>
            <p class="heading">
              <span class="icon is-small mb-2"> <b-skeleton></b-skeleton></span>
              <span class="icon is-small ml-2 mb-2"> <b-skeleton></b-skeleton></span>
              <span class="icon is-small ml-2 mb-2"> <b-skeleton></b-skeleton></span>
            </p>
          </div>
        </div>

        <div v-else v-for="item in powerSupplies" :key="item.name" class="column is-3">
          <div class="notification is-success">
            <p class="title mb-2">{{ item.name }}</p>
            <p class="heading">
              <span class="tag is-light mb-2"><b-icon class="mr-1" pack="fas" icon="car-battery"></b-icon> {{ item.battery_capacity }}Ah</span>
              <span class="tag is-info ml-2 mb-2"><b-icon pack="fas" icon="bolt"></b-icon> {{ item.recentMeasurement.voltage ? item.recentMeasurement.voltage : 0 }}</span>
              <span class="tag is-info ml-2 mb-2"><b-icon pack="fas" icon="bolt"></b-icon> {{ item.recentMeasurement.current ? item.recentMeasurement.current : 0 }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <h1 class="title has-text-left">Messwerte</h1>
    <b-table
        :data="measurements"
        :striped="true"

        :hoverable="true"
        :paginated="true"
        :per-page="20"
        :current-page.sync="currentPage"
        :pagination-simple="false"
        :loading="isLoading"
        :mobile-cards="true">

      <b-table-column field="id" label="#" width="40" numeric sortable v-slot="props">
        <p>{{ props.row.id }}</p>
      </b-table-column>

      <b-table-column field="power_supply.name" label="Stromversorgung" centered width="40" sortable v-slot="props">
        {{ props.row.power_supply.name }}
      </b-table-column>

      <b-table-column field="value" label="Messwert" centered sortable v-slot="props">
        {{ formatValue(props.row.value, props.row.type, 2) }}
      </b-table-column>

      <b-table-column field="type" label="Typ" centered sortable v-slot="props">
        <span v-if="isAlarm(props.row.type)" class="tag is-danger">Alarm</span>
        <span v-else class="tag is-success">Ruhe</span>
      </b-table-column>

      <b-table-column field="timestamp" label="Zeitpunkt" centered sortable v-slot="props">
        {{ new Date(props.row.timestamp).toLocaleDateString() + " " + new Date(props.row.timestamp).toLocaleTimeString() }}
      </b-table-column>

      <template slot="loading">
        <section class="loading">
          <div class="columns">
            <div class="column is-2">
              <b-skeleton size="is-large"></b-skeleton>
            </div>
            <div class="column is-2">
              <b-skeleton size="is-large"></b-skeleton>
            </div>
            <div class="column is-4">
              <b-skeleton size="is-large"></b-skeleton>
            </div>
            <div class="column is-4">
              <b-skeleton size="is-large"></b-skeleton>
            </div>
          </div>

        </section>
      </template>
    </b-table>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Home",

  data: () => ({
    isLoading: true,
    isPowerSupplyLoading: true,
    measurements: [],
    powerSupplies: [],
    currentPage: 1,
  }),
  mounted() {
    setTimeout(() => this.getMeasurements(), 10)
  },
  methods: {
    getMeasurements() {
      axios.get(process.env.VUE_APP_BACKEND_URL + '/rest/measurements')
          .then(res => {
            this.measurements = res.data;
          })
          .finally(() => {
            this.isLoading = false;
            this.getPowersupplies();
          })
    },

    getPowersupplies() {
      axios.get(process.env.VUE_APP_BACKEND_URL + '/rest/power_supplies')
          .then(res => {
            res.data.forEach(item => {
              item['recentMeasurement'] = {
                // https://stackoverflow.com/a/9453443
                'voltage': this.formatValue(this.getLatestMeasurementForPowerSupply(item.id, "VOLTAGE"), "VOLTAGE", 2),
                'current':this.formatValue(this.getLatestMeasurementForPowerSupply(item.id, "CURRENT"), "CURRENT", 2)
              }
              this.powerSupplies.push(item);
            })
          })
          .finally(() => {
            this.isPowerSupplyLoading = false;
          })
    },

    getLatestMeasurementForPowerSupply(powerSupply, type) {
      let item = this.measurements.find(item => item.power_supply.id === powerSupply && item.type === type);
      return item?.value ? item.value : 0.0;
    },

    formatValue(value, type, index) {
      let suffix = type.includes("VOLTAGE") ? "V" : "A";
      return Number(value).toFixed(index) + suffix;
    },

    isAlarm(type) {
      return type.includes("ALARM");
    }
  }
}
</script>

<style scoped>

</style>