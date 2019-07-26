<template>
  <v-content class="home">
    <v-select
      v-model="currentRegion"
      :items="regions"
      :return-object="false"
      item-value="region_id"
      item-text="name"
    />
  </v-content>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';

export default {
  name: 'Home',
  data() {
    return { currentRegion: null };
  },
  computed: {
    ...mapState('Regions', {
      regions: 'data',
    }),
  },
};
</script>

<style scoped>
.home {
  margin: 20px;
}
</style>
