/**
 * ? 处理价格 如: 19912 => 199.12, 100 => 1, 101 => 1.01
 * @param price 价格
 * @returns newPrice 处理后价格, 保留两位小数, 同时去除末尾的0
 */
export const getPrice = (price: number) => parseFloat((price / 100).toFixed(2));
