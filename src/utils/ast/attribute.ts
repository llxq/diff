export interface Attribute {
    name: string
    value: string
}

// 属性正则
const attributeReg = /([:@]?[\w-]+\s*=["']{1}[\s\w-\.]+["']{1})/
// 切割属性正则
const splitAttributeReg = /([:@]?[\w-]+\s*)=["']{1}([\s\w-\.]+)["']{1}/

export const getAttribute = (attributeStr: string): Array<Attribute> => {
    const attributes: Array<Attribute> = []
    if (attributeStr) {
        attributeStr = attributeStr.trim()
        let index = 0
        let residueStr = ''
        while (index < attributeStr.length - 1) {
            residueStr = attributeStr.substring(index)
            if (attributeReg.test(residueStr)) {
                const attribute = residueStr.match(attributeReg)?.[1]
                if (attribute) {
                    const splitAttribute = attribute.match(splitAttributeReg)
                    if (splitAttribute?.length && splitAttribute.length >= 3) {
                        attributes.push({ name: splitAttribute[1], value: splitAttribute[2] })
                    }
                }
                index += attribute?.length ?? 0
            } else {
                index++
            }
        }
    }
    return attributes
}