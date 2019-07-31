<template>
  <v-content class="home">
    <v-container>
      <v-layout column>
        <v-flex>
          <v-select
            v-model="currentRegion"
            :items="regions"
            :return-object="false"
            @change="handleRegionSelect"
            item-value="region_id"
            item-text="name"
            label="Select Region"
          />
        </v-flex>
        <v-flex>
          <v-btn
            v-if="currentRegion"
            @click="() => fetchRegionHistoryData({ regionId: currentRegion })"
            color="primary"
          >
            Reload types
          </v-btn>
        </v-flex>
        <v-flex
          v-if="fetchTotal > 0"
          mt-3
        >
          Loading data... {{ fetched }}/{{ fetchTotal }}
        </v-flex>
        <v-flex>
          <v-progress-linear
            v-if="fetchTotal > 0"
            :value="fetched / fetchTotal * 100"
          />
        </v-flex>
        <v-flex v-if="currentRegion !== null">
          <v-subheader>Last fetch: {{ currentRegionLastFetch }}</v-subheader>
        </v-flex>
        <v-flex>
          <v-expansion-panels
            class="mt-3"
            multiple
          >
            <v-expansion-panel
              v-for="regionHistoryData in currentRegionHistoryDataByAmount"
              :key="regionHistoryData.min"
            >
              <v-expansion-panel-header>
                {{ (regionHistoryData.min / 1000000).toLocaleString() }} M -
                {{ (regionHistoryData.max / 1000000).toLocaleString() }} M
                ({{ regionHistoryData.types.length }} items)
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ItemHistoryDataView :regionData="regionHistoryData" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-flex>
        <v-flex
          v-if="currentRegionHistoryInfo !== null
            && currentRegionHistoryInfo.types.length === 0"
        >
          No relevant items to show
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from 'vuex';
import { formatDistance } from 'date-fns';
import ItemHistoryDataView from '@/components/ItemHistoryDataView';

export default {
  name: 'Home',
  components: {
    ItemHistoryDataView,
  },
  data() {
    return { currentRegion: null };
  },
  computed: {
    ...mapState('Regions', {
      regions: 'data',
    }),
    ...mapState('RegionHistory', {
      regionHistoryData: 'data',
      fetched: 'fetched',
      fetchTotal: 'fetchTotal',
    }),
    currentRegionHistoryInfo() {
      if (this.currentRegion === null) {
        return null;
      }
      const regionTypes = this.regionHistoryData
        .find(region => region.regionId === this.currentRegion);
      if (!regionTypes) {
        return null;
      }
      return regionTypes;
    },
    currentRegionHistoryData() {
      if (this.currentRegionHistoryInfo === null) {
        return [];
      }
      return this.currentRegionHistoryInfo.types.slice().sort(
        (a, b) => b.hist30.averageIskVolume - a.hist30.averageIskVolume,
      );
    },
    currentRegionHistoryDataByAmount() {
      if (this.currentRegionHistoryData.length === 0) {
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
    currentRegionLastFetch() {
      if (this.currentRegionHistoryInfo === null) {
        return null;
      }
      return formatDistance(
        this.currentRegionHistoryInfo.updatedAt,
        Date.now(),
        { addSuffix: true },
      );
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
