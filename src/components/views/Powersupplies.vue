<template>
  <div class="mt-3">
    <h1 class="title has-text-left">Stromversorgungen</h1>
    <b-table
        :data="powersupplies"
        :striped="true"

        :hoverable="true"
        :paginated="true"
        :per-page="20"
        :current-page.sync="currentPage"
        :pagination-simple="false"
        :loading="isLoading"
        :mobile-cards="true"

        checkable
        checkbox-position="right"
        :checked-rows.sync="checkedRows">

      <b-table-column field="id" label="#" width="40" numeric sortable v-slot="props">
        <p>{{ props.row.id }}</p>
      </b-table-column>

      <b-table-column field="name" label="Name" centered sortable v-slot="props">
        {{ props.row.name }}
      </b-table-column>

      <b-table-column field="current" label="Akkukapazität" centered sortable v-slot="props">
        {{ props.row.battery_capacity }}
      </b-table-column>
    </b-table>

    <div class="has-text-left" v-if="checkedRows.length">

      <b-message type="is-danger" class="mt-4" has-icon>
        Die folgenden Aktionen werden für <strong>{{ checkedRows.length }}</strong> Stromversorgungen ausgeführt
      </b-message>

      <button class="button field  is-warning" @click="triggerFault('batteryFault')">
        <b-icon pack="fas" icon="exclamation-triangle"></b-icon>
        <span>Akkustörung auslösen</span>
      </button>

      <button class="button field is-outlined is-danger ml-2" @click="triggerFault('acFault')">
        <b-icon pack="fas" icon="exclamation-triangle"></b-icon>
        <span>Netzstörung auslösen</span>
      </button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Powersupplies",

  data: () => ({
    isLoading: true,
    powersupplies: [],
    currentPage: 1,
    checkedRows: [],
  }),
  mounted() {
    setTimeout(() => this.getPowersupplies(), 10)
  },
  methods: {
    getPowersupplies() {
      axios.get(process.env.VUE_APP_BACKEND_URL + '/rest/power_supplies')
          .then(res => {
            this.powersupplies = res.data;
          })
          .finally(() => {
            this.isLoading = false;
          })
    },
    triggerFault(type) {
      let powerSupplies = this.checkedRows.map((item) => {
        return item.id
      })

      axios.post(process.env.VUE_APP_BACKEND_URL + '/rest/mqtt/send', {
        'power_supplies': powerSupplies,
        'type': type
      })
          .finally(() => {
            this.isLoading = false;
          })
    },
  }
}
</script>

<style>
</style>