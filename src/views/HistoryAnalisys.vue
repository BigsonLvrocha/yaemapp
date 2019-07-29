<template>
  <v-content class="home">
    <v-select
      v-model="currentRegion"
      :items="regions"
      :return-object="false"
      @change="handleRegionSelect"
      item-value="region_id"
      item-text="name"
    />
    <v-list>
      <v-list-item
        v-for="type in currentRegionTypes"
        :key="type"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ type }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-content>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Home',
  data() {
    return { currentRegion: null };
  },
  computed: {
    ...mapState('Regions', {
      regions: 'data',
    }),
    ...mapState('RegionHistory', {
      regionTypes: 'data',
    }),
    currentRegionTypes() {
      if (this.currentRegion === null) {
        return [];
      }
      const regionTypes = this.regionTypes.find(region => region.regionId === this.currentRegion);
      if (!regionTypes) {
        return [];
      }
      return regionTypes.types;
    },
  },
  methods: {
    ...mapActions('RegionHistory', [
      'fetchRegionHistoryTypes',
    ]),
    handleRegionSelect(regionId) {
      const regionTypes = this.regionTypes.find(region => region.regionId === this.currentRegion);
      if (!regionTypes) {
        this.fetchRegionHistoryTypes({ regionId });
      }
    },
  },
};
</script>

<style scoped>
.home {
  margin: 20px;
}
</style>
