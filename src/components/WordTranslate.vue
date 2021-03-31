<template>
  <v-container class="mt-8">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Pointers on transtate (second Array)
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <pointers-table
            :static-segment="staticTranslateRecords"
            :dynamick-segments="dynamickTranslateRecords"
          ></pointers-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-row class="mt-10">
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
        <h3 class="mt-4">Получить перевод русского слова</h3>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="russianRecordToTranslate"
              return-object
              :item-text="pointer => readTranslateRecord(pointer).russianWord"
              :items="staticTranslateRecords"
              hide-details
              label="Выберете русское слово"
            >
            </v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="russianWordTranslate" disabled hide-details label="Перевод">
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn :disabled="!russianRecordToTranslate" @click="onTransleteToEnglish"
              >Перевести</v-btn
            >
          </v-col>
        </v-row>

        <h3 class="mt-4">Получить перевод английского слова</h3>
        <v-row>
          <v-col cols="6">
            <!-- <v-select
              v-model="englishRecordToTranslate"
              return-object
              :item-text="pointer => readPointer(pointer)"
              :items="staticSegment"
              hide-details
              label="Выберете английское слово"
            >
            </v-select> -->
            <v-select
              v-model="englishRecordToTranslate"
              return-object
              :item-text="pointer => readPointer(readTranslateRecord(pointer).linkOnTranslate)"
              :items="staticTranslateRecords"
              hide-details
              label="Выберете английское слово"
            >
            </v-select>
            <!-- <v-select
              v-model="englishRecordToTranslate"
              return-object
              :item-text="pointer => readPointer(pointer)"
              :items="staticSegment"
              hide-details
              label="Выберете английское слово"
            >
            </v-select> -->
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="englishWordTranslate" disabled hide-details label="Перевод">
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn :disabled="!englishRecordToTranslate" @click="onTransleteToRussian"
              >Перевести</v-btn
            >
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <div class="segment-rows">
          <div v-for="(segment, i) in dynamickSegments" :key="i" class="segment">
            <div v-for="(memoryСell, j) in segment" :key="j" class="memory-сell">
              {{ memoryСell }}
            </div>
          </div>
        </div>
        <h3 class="mt-4">Добавить английское слово</h3>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="englishWord" hide-details label="Добавить английское слово">
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn :disabled="!englishWord" @click="addNewEnglishWord">Добавить</v-btn>
          </v-col>
        </v-row>

        <h3 class="mt-4">Добавить запись (русский вариант слова, сслыка на английский перевод)</h3>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="russianWord" hide-details label="Русский варинт слова">
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="linkToEnglishWord"
              return-object
              :item-text="pointer => readPointer(pointer)"
              :items="staticSegment"
              hide-details
              label="Перевод"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-btn :disabled="!russianWord" @click="onAddTranslateRecord">Добавить перевод</v-btn>
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
import PointersTable from '@/components/pointersTable.vue';

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
  name: 'TranslatePointer',
  components: {
    PointersTable,
  },

  setup() {
    const englishWord = ref('');
    const russianWord = ref('');
    const russianRecordToTranslate = ref({});
    const englishWordTranslate = ref('');
    const russianWordTranslate = ref('');

    const englishRecordToTranslate = ref({});
    const textForPointerWrite = ref('');
    const writePointerDialog = ref(false);
    const readPointerDialog = ref(false);
    const readPointerValue = ref('');
    const currentEditablePointer = ref(null);
    const linkToEnglishWord = ref(null);

    const {
      createNewPointer,
      staticSegment,
      dynamickSegments,
      writePointer,
      readPointer,
      freePointer,
    } = usePointers();

    const {
      createNewPointer: createTranslateRecord,
      staticSegment: staticTranslateRecords,
      dynamickSegments: dynamickTranslateRecords,
      writePointer: writeTranslateRecord,
      readPointer: readTranslateRecord,
      // freePointer: removeTranslateRecord,
    } = usePointers();

    // const englishWords = computed(() => {
    //   return staticSegment.map(pointer => readPointer(pointer));
    // });

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

    const addNewEnglishWord = () => {
      try {
        let newPointer = createNewPointer(+new Date(), POINTER_TYPES.Longint);
        writePointer(newPointer, englishWord.value);
      } catch (err) {
        alert(err);
      }
      englishWord.value = '';
    };
    const onAddTranslateRecord = () => {
      let newPointer = createTranslateRecord(+new Date(), POINTER_TYPES.Longint);
      writeTranslateRecord(newPointer, {
        linkOnTranslate: linkToEnglishWord.value,
        russianWord: russianWord.value,
      });
    };
    const onTransleteToRussian = () => {
      englishWordTranslate.value = readTranslateRecord(englishRecordToTranslate.value).russianWord;
    };
    const onTransleteToEnglish = () => {
      const pointerToTranlslate = readTranslateRecord(russianRecordToTranslate.value)
        .linkOnTranslate;

      russianWordTranslate.value = readPointer(pointerToTranlslate);
    };

    return {
      englishWord,
      russianWord,
      linkToEnglishWord,
      onAskWritePointer,
      onWritePointer,
      onReadPointer,
      onFreePointer,
      staticSegment,
      POINTER_TYPES_ARRAY,
      dynamickSegments,
      TABLE_HEADERS,
      addNewEnglishWord,
      writePointerDialog,
      textForPointerWrite,
      readPointerDialog,
      readPointerValue,
      readPointer,
      onAddTranslateRecord,
      staticTranslateRecords,
      dynamickTranslateRecords,
      readTranslateRecord,
      russianRecordToTranslate,
      onTransleteToRussian,
      onTransleteToEnglish,
      englishWordTranslate,
      russianWordTranslate,
      englishRecordToTranslate,
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
