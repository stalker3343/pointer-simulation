<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="TABLE_HEADERS" :items="staticSegment" class="elevation-1">
          <!-- <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="onAskWritePointer(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="onReadPointer(item)">
              mdi-eye
            </v-icon>

            <v-icon small @click="onFreePointer(item)">
              mdi-delete
            </v-icon>
          </template> -->
        </v-data-table>
      </v-col>

      <v-col cols="12">
        <div class="segment-rows">
          <div v-for="(segment, i) in dynamickSegments" :key="i" class="segment">
            <div v-for="(memoryСell, j) in segment" :key="j" class="memory-сell">
              {{ memoryСell }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';

const TABLE_HEADERS = [
  {
    text: 'pointerName',
    value: 'pointerName',
  },
  {
    text: 'segmentNumber',
    value: 'segmentNumber',
  },
  {
    text: 'offset',
    value: 'offset',
  },
  {
    text: 'pointerType',
    value: 'pointerType.name',
  },
  { text: 'Actions', value: 'actions', sortable: false },
];
export default defineComponent({
  name: 'PointerTable',
  props: {
    staticSegment: {
      type: Array,
      required: true,
    },
    dynamickSegments: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return { TABLE_HEADERS };
  },
});
</script>
<style lang="scss">
.segment-rows {
  display: flex;
  flex-direction: column;
}
.segment {
  display: flex;
}
.memory-сell {
  text-align: left;
  width: 100%;
  min-width: 60px;
  min-height: 60px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid black;
  padding: 5px;
  background: rgb(0, 159, 180);
  word-break: break-all;
}
</style>
