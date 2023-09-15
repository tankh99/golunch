import ShopItem from './ShopItem';
export default interface Shop {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    shopImage?: any,
    shopItems: ShopItem[]
}