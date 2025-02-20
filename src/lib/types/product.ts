export enum ProductType {
  APPARELS = "apparels",
  FOODS_DRINKS = "foods_drinks",
  CLASSES = "classes",
  COACHES = "coaches",
}

export enum ApparelType {
  T_SHIRTS = "t-shirt",
  SHORTS = "short",
  GLOVES = "glove",
  TOWEL = "towel",
}

export enum ClassType {
  YOGA = "yoga",
  FITNESS = "fitness",
  BOXING = "boxing",
}

export enum CoachType {
  SIR = "sir",
  MAAM = "maam",
  MISS = "miss",
}

export const productCollectionMap: Record<ProductType, string> = Object.values(
  ProductType
).reduce(
  (map, type) => {
    map[type] = type;
    return map;
  },
  {} as Record<ProductType, string>
);
