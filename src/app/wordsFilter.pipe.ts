import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'wordsFilter' })
export class WordsFilter implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} words
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(words: any[], searchText: string): any[] {
    if (!words) {
      return [];
    }
    if (!searchText) {
      return words;
    }
    searchText = searchText.toLocaleLowerCase();

    return words.filter(it => {
      return it.word.toLocaleLowerCase().includes(searchText);
    });
  }
}
