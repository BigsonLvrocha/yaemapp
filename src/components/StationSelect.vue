<template>
  <v-layout column>
    <v-flex>
      <v-select
        v-model="regionId"
        :items="regionOptions"
        label="Select Region"
        item-text="name"
        item-value="region_id"
      />
    </v-flex>
    <v-flex v-if="regionId !== null">
      <v-select
        v-model="constellationId"
        :items="constellationOptions"
        label="Select Constellation"
        item-text="name"
        item-value="constellation_id"
      />
    </v-flex>
    <v-flex v-if="constellationId !== null">
      <v-select
        v-model="systemId"
        :items="systemOptions"
        label="Select System"
        item-text="name"
        item-value="system_id"
      />
    </v-flex>
    <v-flex v-if="systemId !== null">
      <v-select
        v-model="stationId"
        :items="stationOptions"
        label="Select Station"
        item-text="name"
        item-value="station_id"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('StationSelect', [
      'region',
      'constellation',
      'system',
      'station',
    ]),
    regionId: {
      get() {
        return this.$store.state.StationSelect.regionId;
      },
      set(regionId) {
        this.$store.dispatch('StationSelect/setRegionId', {
          regionId,
        });
      },
    },
    constellationId: {
      get() {
        return this.$store.state.StationSelect.constellationId;
      },
      set(constellationId) {
        this.$store.dispatch('StationSelect/setConstellationId', {
          constellationId,
        });
      },
    },
    systemId: {
      get() {
        return this.$store.state.StationSelect.systemId;
      },
      set(systemId) {
        this.$store.dispatch('StationSelect/setSystemId', {
          systemId,
        });
      },
    },
    stationId: {
      get() {
        return this.$store.state.StationSelect.stationId;
      },
      set(stationId) {
        this.$store.dispatch('StationSelect/setStationId', {
          stationId,
        });
      },
    },
    regionOptions() {
      return this.$store.state.Regions.data;
    },
    constellationOptions() {
      return this.$store.getters['StationSelect/regionConstellations'];
    },
    systemOptions() {
      return this.$store.getters['StationSelect/constellationSystems'];
    },
    stationOptions() {
      return this.$store.getters['StationSelect/systemStations'];
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
