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
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('StationSelect', [
      'region',
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
    regionOptions() {
      return this.$store.state.Regions.data;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
