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
    regionOptions() {
      return this.$store.state.Regions.data;
    },
    constellationOptions() {
      return this.$store.getters['StationSelect/regionConstellations'];
    },
    systemOptions() {
      return this.$store.getters['StationSelect/constellationSystems'];
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
