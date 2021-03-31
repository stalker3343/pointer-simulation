<template>
  <v-container class="mt-8">
    <v-row>
      <v-col cols="6">
        <v-data-table :headers="TABLE_HEADERS" :items="staticSegment" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="onAskWritePointer(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="onReadPointer(item)">
              mdi-eye
            </v-icon>

            <v-icon small @click="onFreePointer(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>

      <v-col cols="6">
        <div class="segment-rows">
          <div v-for="(segment, i) in dynamickSegments" :key="i" class="segment">
            <div v-for="(memoryСell, j) in segment" :key="j" class="memory-сell">
              {{ memoryСell }}
            </div>
          </div>
        </div>
        <h3 class="mt-4">Добавить указатель</h3>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="newPointerName" hide-details label="Название указателя">
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="newPointerType"
              return-object
              item-text="name"
              :items="POINTER_TYPES_ARRAY"
              hide-details
              label="Тип указателя"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-btn :disabled="!newPointerName || !newPointerType.name" @click="addNewPointer"
              >Добавить</v-btn
            >
          </v-col>
        </v-row>

        <h3 class="mt-4">Присвоить значение одного указателя другому</h3>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="fromPointer"
              return-object
              item-text="pointerName"
              :items="staticSegment"
              hide-details
              label="Из указателя"
            >
            </v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="toPointer"
              return-object
              item-text="pointerName"
              :items="staticSegment"
              hide-details
              label="В указатель"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            Левый указатель будет ссылаться на праввый
          </v-col>
          <v-col cols="12">
            <v-btn @click="onSetPointer">Записать</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="writePointerDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Вы уверены что хотите записать указатель?</v-card-title>
        <v-card-text>
          <v-text-field v-model="textForPointerWrite" hide-details label="Значение для записи">
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="writePointerDialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="onWritePointer">Записать</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="readPointerDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline"></v-card-title>
        <v-card-text>
          <v-text-field v-model="readPointerValue" disabled hide-details label="Значение указателя">
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="readPointerDialog = false">Закрыть</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api';
import { usePointers } from '@/compositions/usePointers.js';

const POINTER_TYPES = {
  Byte: {
    name: 'byte',
    length: 1,
    symbol: 'B',
  },
  Int: {
    name: 'int',
    length: 2,
    symbol: 'i',
  },
  Longint: {
    name: 'longint',
    length: 4,
    symbol: 'L',
  },
};

const POINTER_TYPES_ARRAY = Object.keys(POINTER_TYPES).map(key => POINTER_TYPES[key]);
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
  name: 'Pointer',

  setup() {
    const newPointerName = ref('');
    const newPointerType = ref({});
    const textForPointerWrite = ref('');
    const writePointerDialog = ref(false);
    const readPointerDialog = ref(false);
    const readPointerValue = ref('');
    const currentEditablePointer = ref(null);
    const fromPointer = ref(null);
    const toPointer = ref(null);

    const {
      createNewPointer,
      staticSegment,
      dynamickSegments,
      writePointer,
      readPointer,
      setPointer,
      freePointer,
    } = usePointers();

    const onAskWritePointer = pointer => {
      currentEditablePointer.value = pointer;
      writePointerDialog.value = true;
    };
    const onWritePointer = () => {
      // currentEditablePointer
      try {
        writePointer(currentEditablePointer.value, textForPointerWrite.value);
        textForPointerWrite.value = '';
      } catch (err) {
        textForPointerWrite.value = '';
        alert(err);
      }
      currentEditablePointer.value = null;
      writePointerDialog.value = false;
    };
    const onReadPointer = pointer => {
      try {
        readPointerValue.value = readPointer(pointer);
        readPointerDialog.value = true;
      } catch (err) {
        alert(err);
      }
    };
    const onFreePointer = pointer => {
      freePointer(pointer);
    };

    const addNewPointer = () => {
      try {
        createNewPointer(
          newPointerName.value,
          newPointerType.value
          // staticSegment,
          // dynamickSegments
        );
      } catch (err) {
        alert(err);
      }
      newPointerName.value = '';
      newPointerType.value = {};
    };

    const onSetPointer = () => {
      try {
        setPointer(fromPointer.value, toPointer.value);
      } catch (err) {
        alert(err);
      }
    };

    return {
      onAskWritePointer,
      onWritePointer,
      onReadPointer,
      onFreePointer,
      staticSegment,
      POINTER_TYPES_ARRAY,
      dynamickSegments,
      TABLE_HEADERS,
      newPointerName,
      newPointerType,
      addNewPointer,
      writePointerDialog,
      textForPointerWrite,
      readPointerDialog,
      readPointerValue,
      fromPointer,
      toPointer,
      onSetPointer,
    };
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
  text-align: center;
  width: 100%;
  min-width: 60px;
  min-height: 60px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 2px solid black;
  padding: 5px;
  background: rgb(0, 159, 180);
  word-break: break-all;
}
</style>
