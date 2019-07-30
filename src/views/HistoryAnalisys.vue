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
    <v-btn
      v-if="currentRegion"
      @click="() => fetchRegionHistoryData({ regionId: currentRegion })"
      color="primary"
    >
      Reload types
    </v-btn>
    <v-expansion-panels
      class="mt-3"
      multiple
    >
      <v-expansion-panel
        v-for="regionHistoryData in currentRegionHistoryDataByAmount"
        :key="regionHistoryData.min"
      >
        <v-expansion-panel-header>
          {{ regionHistoryData.min / 1000000 }} M - {{ regionHistoryData.max / 1000000 }} M
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item
              v-for="type in regionHistoryData.types"
              :key="type.typeId"
            >
              <v-list-item-title>{{ type.typeId }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
      regionHistoryData: 'data',
    }),
    currentRegionHistoryData() {
      if (this.currentRegion === null) {
        return [];
      }
      const regionTypes = this.regionHistoryData
        .find(region => region.regionId === this.currentRegion);
      if (!regionTypes) {
        return [];
      }
      return regionTypes.types.slice().sort(
        (a, b) => b.hist30.averageIskVolume - a.hist30.averageIskVolume,
      );
    },
    currentRegionHistoryDataByAmount() {
      if (this.currentRegion === null || this.currentRegionHistoryData.length === 0) {
        return [];
      }
      const sections = [];
      const maxAverageIskVolume = this.currentRegionHistoryData[0].hist30.averageIskVolume;
      for (
        let magnetude = Math.ceil(Math.log10(maxAverageIskVolume));
        magnetude > 6;
        magnetude -= 1
      ) {
        for (let i = 10; i > 1; i -= 1) {
          const types = this.currentRegionHistoryData.filter(
            item => (i - 1) * (10 ** magnetude) < item.hist30.averageIskVolume
              && item.hist30.averageIskVolume < i * (10 ** magnetude),
          );
          if (types.length > 0) {
            sections.push({
              max: i * (10 ** magnetude),
              min: (i - 1) * (10 ** magnetude),
              types,
            });
          }
        }
      }
      return sections;
    },
  },
  methods: {
    ...mapActions('RegionHistory', [
      'fetchRegionHistoryData',
    ]),
    handleRegionSelect(regionId) {
      const regionHistoryData = this.regionHistoryData
        .find(region => region.regionId === this.currentRegion);
      if (!regionHistoryData) {
        this.fetchRegionHistoryData({ regionId });
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
