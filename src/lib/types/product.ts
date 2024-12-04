export enum ProductType {
  Classes = "classes",
  Apparels = "apparels",
  FoodsDrinks = "foods_drinks",
}

export const productCollectionMap: { [key in ProductType]: string } = {
  [ProductType.Classes]: "class_id",
  [ProductType.Apparels]: "apparels_id",
  [ProductType.FoodsDrinks]: "foods_drinks_id",
};
