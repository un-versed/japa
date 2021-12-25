/**
 * @module SlimRunner
 */

/*
 * japa
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * Loads files using the glob patterns.
 *
 * @class Loader
 */
export class Loader {
  private _glob: string[] | string
  private _filterFn: (file: string) => void
  private _sortFn: (a: string, b: string) => number

  /**
   * Define the glob for the files
   */
  public files (glob: string[] | string): void {
    this._glob = glob
  }

  /**
   * Define a custom filter function to filter files
   */
  public filter (cb: (file: string) => void) {
    this._filterFn = cb
  }

  /**
   * Define a custom sorting function to filter files
   */
  public sort (cb: (a: string, b: string) => number) {
    this._sortFn = cb
  }

  /**
   * Returns an array of sorted files based on the glob
   * pattern.
   */
  public async loadFiles (): Promise<string[]> {
    if (!this._glob) {
      return []
    }

    const fg = await import('fast-glob')
    let filesPaths = await fg.default(this._glob, {
      absolute: true,
      onlyFiles: false,
    }) as string[]

    /**
     * If filterFn is defined, then filter the files
     */
    if (typeof (this._filterFn) === 'function') {
      filesPaths = filesPaths.filter((file) => this._filterFn(file))
    }

    /**
     * If _sortFn is defined, then filter the files
     */
    if (typeof (this._sortFn) === 'function') {
      filesPaths = filesPaths.sort(this._sortFn)
    } else {
      filesPaths.sort()
    }

    return filesPaths
  }
}
