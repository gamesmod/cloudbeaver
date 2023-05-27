/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

const isObjectEqual = <T>(a: T, b: T) => a === b;

export function isArraysEqual<T>(first: T[], second: T[], isEqual: (a: T, b: T) => boolean = isObjectEqual, order?: boolean): boolean {
  if (first.length !== second.length) {
    return false;
  }

  return !first.some((b, index) => {
    if (order) {
      return !isEqual(second[index], b);
    }

    return !second.some(a => isEqual(a, b));
  });
}
