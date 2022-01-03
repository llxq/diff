export default class Scanned {

    // 当前指针
    public index: number = 0

    // 剩下的字符串
    public remainStr: string

    constructor (public templateStr: string) {
        this.remainStr = this.templateStr
    }

    private next (): void {
        this.remainStr = this.getSubStr(++this.index)
    }

    // 跳过
    public skip (tag: string): void {
        if (this.remainStr.startsWith(tag)) {
            this.index += tag.length
            this.remainStr = this.getSubStr(this.index)
        }
    }

    // 找到当前标签在的位置
    public find (tag: string): string {
        const startIndex = this.index
        while (this.hasNext && !this.remainStr.startsWith(tag)) this.next()
        const result = this.getSubStr(startIndex, this.index)
        // 跳过当前循环的
        this.skip(tag)
        return result
    }

    public get hasNext (): boolean {
        return this.index < this.templateStr.length
    }

    private getSubStr (index: number, endIndex?: number): string {
        return this.templateStr.substring(index, endIndex)
    }
}
