import { reactive } from '@vue/composition-api';
import { byField } from '@/compositions/helpers.js';
// import Vue from 'vue';

export const usePointers = () => {
  const staticSegment = reactive([]);

  const dynamickSegments = reactive([
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]);

  const checkSegment = (segmentNumber, pointerType) => {
    const staticSegmentPointers = staticSegment.filter(
      segment => segment.segmentNumber === segmentNumber
    );
    if (!staticSegmentPointers.length) return { segmentNumber: segmentNumber, offset: 0 };

    staticSegmentPointers.sort(byField('offset'));
    let startOffset = 0;

    for (let i = 0; i < staticSegmentPointers.length; i++) {
      if (staticSegmentPointers[i].offset - startOffset >= pointerType.length) {
        // res = { segmentNumber: segmentNumber, offset: startOffset };
        break;
      } else {
        startOffset = staticSegmentPointers[i].offset + staticSegmentPointers[i].pointerType.length;
      }
    }

    const segmentLength = dynamickSegments[segmentNumber].length;
    if (segmentLength - startOffset < pointerType.length) {
      return -1;
    } else {
      return { segmentNumber: segmentNumber, offset: startOffset };
    }
  };
  // проверка все сегментов
  const findPlaceInMemory = pointerType => {
    //  pointerType
    // if (!staticSegment.length) return { segmentNumber: 0, offset: 0 };
    let res = -1;
    let currentSegment = 0;
    do {
      res = checkSegment(currentSegment, pointerType);
      currentSegment++;
    } while (res === -1 && currentSegment < dynamickSegments.length);
    if (res === -1) throw new Error('[findPlaceInMemory] Не нашлось свободного места');
    return res;
  };

  const writeToMemory = (segmentNumber, offset, pointerType, symbolForWrite) => {
    // let tetxToWrite = pointerType.symbol;
    // if (symbolForWrite && symbolForWrite !== '') {
    //   tetxToWrite = symbolForWrite + `[${pointerType.symbol}]`;
    // }

    for (let i = 0; i < pointerType.length; i++) {
      // if (dynamickSegments[segmentNumber][0 + offset + i])
      //   throw new Error('[writeToMemory] Ячейка памяти уже заполнена');

      dynamickSegments[segmentNumber][0 + offset + i] = symbolForWrite;
    }
  };
  const checkUnicPointerName = name => {
    let isUnic = true;
    staticSegment.map(pointer => {
      console.log(pointer.pointerName);
      if (pointer.pointerName === name) isUnic = false;
    });
    return isUnic;
  };

  const createNewPointer = (pointerName, pointerType) => {
    const isNameUnic = checkUnicPointerName(pointerName);
    if (!isNameUnic) throw new Error('[createNewPointer] Имя указателя не уникально');

    let { segmentNumber, offset } = findPlaceInMemory(pointerType);
    const newPointer = {
      pointerName,
      segmentNumber,
      offset,
      pointerType,
    };

    // writeToMemory(segmentNumber, offset, pointerType, pointerType.symbol);
    staticSegment.push(newPointer);
    return newPointer;
  };

  const writePointer = (pointer, value) => {
    writeToMemory(
      pointer.segmentNumber,
      pointer.offset,
      pointer.pointerType,
      value
      // TODO Enable on fist test stend
      // `${value} [${pointer.pointerType.symbol}]`
    );
  };

  const readPointer = pointer => {
    if (!dynamickSegments[pointer.segmentNumber][pointer.offset])
      throw new Error('[readPointer] В Указатель ничего не запсано');
    return dynamickSegments[pointer.segmentNumber][pointer.offset];
  };

  const setPointer = (fromPointer, toPointer) => {
    if (toPointer.pointerType.name !== fromPointer.pointerType.name) {
      throw new Error('[setPointer] Типы указателей не совпадают');
    }
    if (toPointer.pointerName === fromPointer.pointerName) {
      throw new Error('[setPointer] Запись указателя самого в себя');
    }
    let indexFromPointer = staticSegment.findIndex(
      pointer => pointer.pointerName === fromPointer.pointerName
    );

    if (!~indexFromPointer) {
      throw new Error('[setPointer] Не нашли указателm');
    }

    staticSegment.splice(indexFromPointer, 1, {
      pointerName: fromPointer.pointerName,
      segmentNumber: toPointer.segmentNumber,
      offset: toPointer.offset,
      pointerType: fromPointer.pointerType,
    });

    writeToMemory(fromPointer.segmentNumber, fromPointer.offset, fromPointer.pointerType, '');
  };
  const freePointer = pointer => {
    let indexPointer = staticSegment.findIndex(
      massPointer => massPointer.pointerName === pointer.pointerName
    );
    staticSegment.splice(indexPointer, 1);
    writeToMemory(pointer.segmentNumber, pointer.offset, pointer.pointerType, '');
  };

  return {
    createNewPointer,
    staticSegment,
    dynamickSegments,
    writePointer,
    readPointer,
    setPointer,
    freePointer,
  };
};
