export const UNITS = [
  { key: 'grams' },
  { key: 'kcal' },
  { key: 'milligrams' },
  { key: 'kJ' },
  { key: 'micrograms' },
] as const

export const NUTRIENTS = [
  { key: 'alanine', name: 'Alanine' },
  { key: 'alcohol', name: 'Alcohol' },
  { key: 'arginine', name: 'Arginine' },
  { key: 'ash', name: 'Ash' },
  { key: 'aspartic_acid', name: 'Aspartic acid' },
  { key: 'beta_sitosterol', name: 'Beta-sitosterol' },
  { key: 'betaine', name: 'Betaine' },
  { key: 'caffeine', name: 'Caffeine' },
  { key: 'calcium', name: 'Calcium' },
  { key: 'campesterol', name: 'Campesterol' },
  { key: 'carotene_alpha', name: 'Carotene, alpha' },
  { key: 'carotene_beta', name: 'Carotene, beta' },
  { key: 'cholesterol', name: 'Cholesterol' },
  { key: 'choline', name: 'Choline' },
  { key: 'copper', name: 'Copper' },
  { key: 'cryptoxanthin_beta', name: 'Cryptoxanthin, beta' },
  { key: 'cystine', name: 'Cystine' },
  { key: 'energy', name: 'Energy' },
  { key: 'energy', name: 'Energy' },
  { key: 'fat', name: 'Fat' },
  { key: 'fatty_acids_monounsaturated', name: 'Fatty acids, monounsaturated' },
  { key: 'fatty_acids_polyunsaturated', name: 'Fatty acids, polyunsaturated' },
  { key: 'fatty_acids_saturated', name: 'Fatty acids, saturated' },
  { key: 'fatty_acids_trans_dienoic', name: 'Fatty acids, trans-dienoic' },
  { key: 'fatty_acids_trans_monoenoic', name: 'Fatty acids, trans-monoenoic' },
  { key: 'fatty_acids_trans_polyenoic', name: 'Fatty acids, trans-polyenoic' },
  { key: 'fatty_acids_trans', name: 'Fatty acids, trans' },
  { key: 'fiber', name: 'Fiber' },
  { key: 'folate', name: 'Folate' },
  { key: 'folic_acid', name: 'Folic acid' },
  { key: 'fructose', name: 'Fructose' },
  { key: 'galactose', name: 'Galactose' },
  { key: 'glucose', name: 'Glucose' },
  { key: 'glutamic_acid', name: 'Glutamic acid' },
  { key: 'glycine', name: 'Glycine' },
  { key: 'histidine', name: 'Histidine' },
  { key: 'hydroxyproline', name: 'Hydroxyproline' },
  { key: 'iron', name: 'Iron' },
  { key: 'isoleucine', name: 'Isoleucine' },
  { key: 'lactose', name: 'Lactose' },
  { key: 'leucine', name: 'Leucine' },
  { key: 'lutein_zeaxanthin', name: 'Lutein + zeaxanthin' },
  { key: 'lycopene', name: 'Lycopene' },
  { key: 'lysine', name: 'Lysine' },
  { key: 'magnesium', name: 'Magnesium' },
  { key: 'maltose', name: 'Maltose' },
  { key: 'manganese', name: 'Manganese' },
  { key: 'methionine', name: 'Methionine' },
  { key: 'niacin', name: 'Niacin' },
  { key: 'nitrogen', name: 'Nitrogen' },
  { key: 'pantothenic_acid', name: 'Pantothenic acid' },
  { key: 'phenylalanine', name: 'Phenylalanine' },
  { key: 'phosphorus', name: 'Phosphorus' },
  { key: 'phytosterols', name: 'Phytosterols' },
  { key: 'potassium', name: 'Potassium' },
  { key: 'proline', name: 'Proline' },
  { key: 'protein', name: 'Protein' },
  { key: 'retinol', name: 'Retinol' },
  { key: 'riboflavin', name: 'Riboflavin' },
  { key: 'selenium', name: 'Selenium' },
  { key: 'serine', name: 'Serine' },
  { key: 'sodium', name: 'Sodium' },
  { key: 'starch', name: 'Starch' },
  { key: 'stigmasterol', name: 'Stigmasterol' },
  { key: 'sucrose', name: 'Sucrose' },
  { key: 'sugars', name: 'Sugars' },
  { key: 'theobromine', name: 'Theobromine' },
  { key: 'thiamin', name: 'Thiamin' },
  { key: 'threonine', name: 'Threonine' },
  { key: 'tocopherol_beta', name: 'Tocopherol, beta' },
  { key: 'tocopherol_delta', name: 'Tocopherol, delta' },
  { key: 'tocopherol_gamma', name: 'Tocopherol, gamma' },
  { key: 'tocotrienol_alpha', name: 'Tocotrienol, alpha' },
  { key: 'tocotrienol_beta', name: 'Tocotrienol, beta' },
  { key: 'tocotrienol_delta', name: 'Tocotrienol, delta' },
  { key: 'tocotrienol_gamma', name: 'Tocotrienol, gamma' },
  { key: 'tryptophan', name: 'Tryptophan' },
  { key: 'tyrosine', name: 'Tyrosine' },
  { key: 'valine', name: 'Valine' },
  { key: 'vitamin_a', name: 'Vitamin A' },
  { key: 'vitamin_b12', name: 'Vitamin B12' },
  { key: 'vitamin_b6', name: 'Vitamin B6' },
  { key: 'vitamin_c', name: 'Vitamin C' },
  { key: 'vitamin_d', name: 'Vitamin D' },
  { key: 'vitamin_e', name: 'Vitamin E' },
  { key: 'vitamin_k', name: 'Vitamin K' },
  { key: 'water', name: 'Water' },
  { key: 'zinc', name: 'Zinc' },
] as const

export type IUnitKey = typeof UNITS[number]['key']
export type INutrientKey = typeof NUTRIENTS[number]['key']