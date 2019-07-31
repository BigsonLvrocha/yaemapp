<template>
  <v-list>
    <v-list-item
      v-for="(type, index) in regionData.types"
      :key="type.typeId"
    >
      <v-list-item-title>
        {{ typesInfo[index] === undefined
          ? 'Loading...'
          : `${typesInfo[index].name} (${typesInfo[index].type_id})` }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    regionData: {
      required: true,
      type: Object,
    },
  },
  computed: {
    typesInfo() {
      return this.regionData.types.map(
        item => this.$store.state.Types.data.find(a => a.type_id === item.typeId),
      );
    },
  },
  mounted() {
    this.fetchTypeIdArrayData({ typeIds: this.regionData.types.map(item => item.typeId) });
  },
  methods: {
    ...mapActions('Types', [
      'fetchTypeIdArrayData',
    ]),
  },
};
</script>
