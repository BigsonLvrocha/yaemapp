<template>
  <v-data-table
    :items="typesInfo"
    :headers="headers"
    :items-per-page="5"
    @current-items="tablePaged"
    sort-by="hist30.averageIskVolume"
    sort-desc
    item-key="type_id"
    must-sort
  >
    <template #item.type.name="{ item, value }">
      {{ value === undefined ? 'fetching...' : value }}
    </template>
    <template #item.hist30.averageIskVolume="{ item, value }">
      {{ (value / 1000000).toLocaleString('default', {
        maximumFractionDigits: 2
      }) }} M ± {{
        (item.hist30.stdDevIskVolume / value).toLocaleString('default', {
          style: 'percent'
        })
      }}
    </template>
    <template #item.hist15.averageIskVolume="{ item, value }">
      {{ (value / 1000000).toLocaleString('default', {
        maximumFractionDigits: 2
      }) }} M ± {{
        (item.hist15.stdDevIskVolume / value).toLocaleString('default', {
          style: 'percent'
        })
      }}
    </template>
    <template #item.hist7.averageIskVolume="{ item, value }">
      {{ (value / 1000000).toLocaleString('default', {
        maximumFractionDigits: 2
      }) }} M ± {{
        (item.hist7.stdDevIskVolume / value).toLocaleString('default', {
          style: 'percent'
        })
      }}
    </template>
    <template #item.hist30.averageVolume="{ item, value }">
      {{ (value).toLocaleString('default', {
        maximumFractionDigits: 0
      }) }} ± {{
        (item.hist30.stdDevVolume / value).toLocaleString('default', {
          style: 'percent'
        })
      }}
    </template>
    <template #item.hist15.averageVolume="{ item, value }">
      {{ (value).toLocaleString('default', {
        maximumFractionDigits: 0
      }) }} ± {{
        (item.hist15.stdDevVolume / value).toLocaleString('default', {
          style: 'percent'
        })
      }}
    </template>
    <template #item.hist7.averageVolume="{ item, value }">
      {{ (value).toLocaleString('default', {
        maximumFractionDigits: 0
      }) }} ± {{
        (item.hist7.stdDevVolume / value).toLocaleString('default', {
          style: 'percent'
        })
      }}
    </template>
  </v-data-table>
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
  data() {
    return {
      headers: [
        {
          value: 'type.name',
          text: 'Name',
          sortable: true,
        },
        {
          value: 'hist7.averageIskVolume',
          text: 'Average Isk Volume (7 days)',
          sortable: true,
        },
        {
          value: 'hist7.averageVolume',
          text: 'Average Volume (7 days)',
          sortable: true,
        },
        {
          value: 'hist15.averageIskVolume',
          text: 'Average Isk Volume (15 days)',
          sortable: true,
        },
        {
          value: 'hist15.averageVolume',
          text: 'Average Volume (15 days)',
          sortable: true,
        },
        {
          value: 'hist30.averageIskVolume',
          text: 'Average Isk Volume (30 days)',
          sortable: true,
        },
        {
          value: 'hist30.averageVolume',
          text: 'Average Volume (30 days)',
          sortable: true,
        },
      ],
      pagination: {
        orderBy: 'hist30.averageIskVolume',
        descending: true,
        rowsPerPage: 5,
      },
    };
  },
  computed: {
    typesInfo() {
      return this.regionData.types.map(
        item => ({
          ...item,
          type: this.$store.state.Types.data.find(a => a.type_id === item.typeId),
        }),
      );
    },
  },
  methods: {
    ...mapActions('Types', [
      'fetchTypeIdArrayData',
    ]),
    tablePaged(items) {
      this.fetchTypeIdArrayData({ typeIds: items.map(item => item.typeId) });
    },
  },
};
</script>
