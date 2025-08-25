// Données géographiques complètes des 58 wilayas d'Algérie
// Coordonnées améliorées et plus réalistes basées sur les vraies positions géographiques

export const ALGERIA_COMPLETE_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    // Les 48 wilayas originales (améliorées)
    {
      "type": "Feature",
      "properties": { "code": "01", "name": "Adrar", "arName": "أدرار" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.5, 27.5], [-0.5, 28.2], [0.8, 27.0], [0.2, 26.0], [-1.5, 25.8], [-3.2, 26.5], [-2.5, 27.5]]]
      }
    },
    {
      "type": "Feature", 
      "properties": { "code": "02", "name": "Chlef", "arName": "الشلف" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0.8, 36.0], [1.8, 36.4], [2.4, 36.2], [1.9, 35.8], [0.9, 35.9], [0.8, 36.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "03", "name": "Laghouat", "arName": "الأغواط" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0.5, 33.5], [2.8, 34.0], [3.5, 33.2], [2.0, 32.0], [0.0, 32.5], [0.5, 33.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "04", "name": "Oum El Bouaghi", "arName": "أم البواقي" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[6.2, 35.6], [7.2, 36.0], [7.6, 35.5], [6.9, 35.2], [6.3, 35.3], [6.2, 35.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "05", "name": "Batna", "arName": "باتنة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[5.5, 35.2], [6.8, 35.9], [7.4, 35.3], [6.6, 34.7], [5.2, 34.9], [5.5, 35.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "06", "name": "Béjaïa", "arName": "بجاية" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[4.6, 36.3], [5.4, 36.8], [5.9, 36.5], [5.2, 36.0], [4.7, 36.1], [4.6, 36.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "07", "name": "Biskra", "arName": "بسكرة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[4.8, 34.2], [6.2, 35.0], [7.5, 34.3], [6.8, 33.0], [5.0, 33.2], [4.8, 34.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "08", "name": "Béchar", "arName": "بشار" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-1.8, 31.5], [-0.2, 32.8], [0.5, 31.8], [-0.5, 30.2], [-2.3, 30.8], [-1.8, 31.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "09", "name": "Blida", "arName": "البليدة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2.6, 36.3], [3.1, 36.6], [3.4, 36.3], [2.9, 36.0], [2.7, 36.1], [2.6, 36.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "10", "name": "Bouira", "arName": "البويرة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[3.8, 36.1], [4.4, 36.5], [4.7, 36.2], [4.1, 35.8], [3.9, 35.9], [3.8, 36.1]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "11", "name": "Tamanrasset", "arName": "تمنراست" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[4.0, 23.0], [6.5, 25.0], [8.0, 23.5], [6.8, 21.5], [4.5, 22.0], [4.0, 23.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "12", "name": "Tébessa", "arName": "تبسة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[7.8, 35.2], [8.6, 35.5], [8.9, 35.0], [8.3, 34.6], [7.9, 34.8], [7.8, 35.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "13", "name": "Tlemcen", "arName": "تلمسان" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-1.3, 34.8], [-0.5, 35.2], [-0.2, 34.9], [-0.8, 34.4], [-1.5, 34.6], [-1.3, 34.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "14", "name": "Tiaret", "arName": "تيارت" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0.5, 35.0], [1.8, 35.4], [2.3, 35.0], [1.5, 34.6], [0.7, 34.7], [0.5, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "15", "name": "Tizi Ouzou", "arName": "تيزي وزو" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[3.8, 36.5], [4.4, 36.9], [4.7, 36.6], [4.2, 36.3], [3.9, 36.4], [3.8, 36.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "16", "name": "Alger", "arName": "الجزائر" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[3.0, 36.5], [3.5, 36.8], [3.8, 36.6], [3.4, 36.3], [3.1, 36.4], [3.0, 36.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "17", "name": "Djelfa", "arName": "الجلفة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2.0, 34.2], [3.8, 35.0], [4.5, 34.4], [3.5, 33.7], [2.3, 33.9], [2.0, 34.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "18", "name": "Jijel", "arName": "جيجل" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[5.5, 36.4], [6.2, 36.8], [6.5, 36.5], [5.9, 36.1], [5.6, 36.2], [5.5, 36.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "19", "name": "Sétif", "arName": "سطيف" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[5.2, 35.7], [5.8, 36.2], [6.1, 35.9], [5.6, 35.5], [5.3, 35.6], [5.2, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "20", "name": "Saïda", "arName": "سعيدة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-0.5, 34.9], [0.1, 35.3], [0.4, 35.0], [-0.1, 34.6], [-0.7, 34.7], [-0.5, 34.9]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "21", "name": "Skikda", "arName": "سكيكدة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[6.4, 36.4], [7.0, 36.8], [7.3, 36.5], [6.8, 36.1], [6.5, 36.2], [6.4, 36.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "22", "name": "Sidi Bel Abbès", "arName": "سيدي بلعباس" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-1.0, 35.2], [-0.3, 35.5], [0.0, 35.2], [-0.5, 34.9], [-1.1, 35.0], [-1.0, 35.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "23", "name": "Annaba", "arName": "عنابة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[7.7, 36.7], [8.4, 37.1], [8.8, 36.8], [8.2, 36.4], [7.8, 36.5], [7.7, 36.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "24", "name": "Guelma", "arName": "قالمة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[7.7, 36.2], [8.4, 36.5], [8.7, 36.2], [8.2, 35.9], [7.8, 36.0], [7.7, 36.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "25", "name": "Constantine", "arName": "قسنطينة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[6.0, 36.2], [6.7, 36.7], [7.4, 36.4], [6.9, 36.0], [6.2, 36.1], [6.0, 36.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "26", "name": "Médéa", "arName": "المدية" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2.6, 35.7], [3.4, 36.2], [3.8, 35.9], [3.2, 35.5], [2.8, 35.6], [2.6, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "27", "name": "Mostaganem", "arName": "مستغانم" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0.3, 35.7], [1.0, 36.1], [1.4, 35.8], [0.8, 35.5], [0.4, 35.6], [0.3, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "28", "name": "M'Sila", "arName": "المسيلة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[3.7, 34.7], [4.7, 35.4], [5.2, 35.0], [4.4, 34.4], [3.9, 34.5], [3.7, 34.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "29", "name": "Mascara", "arName": "معسكر" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0.4, 35.2], [1.1, 35.6], [1.5, 35.3], [0.9, 35.0], [0.5, 35.1], [0.4, 35.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "30", "name": "Ouargla", "arName": "ورقلة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[5.0, 31.5], [6.8, 33.0], [8.2, 31.8], [7.2, 30.0], [5.5, 30.5], [5.0, 31.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "31", "name": "Oran", "arName": "وهران" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-1.0, 35.7], [-0.2, 36.1], [0.2, 35.8], [-0.4, 35.5], [-1.1, 35.6], [-1.0, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "32", "name": "El Bayadh", "arName": "البيض" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-0.8, 33.2], [0.7, 34.0], [1.2, 33.4], [0.2, 32.7], [-0.6, 32.9], [-0.8, 33.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "33", "name": "Illizi", "arName": "إليزي" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[9.0, 27.0], [11.0, 29.0], [12.0, 27.5], [10.5, 25.5], [9.3, 26.2], [9.0, 27.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "34", "name": "Bordj Bou Arréridj", "arName": "برج بوعريريج" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[4.7, 35.7], [5.3, 36.2], [5.6, 35.9], [5.1, 35.5], [4.8, 35.6], [4.7, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "35", "name": "Boumerdès", "arName": "بومرداس" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[3.3, 36.7], [4.0, 37.0], [4.3, 36.7], [3.8, 36.4], [3.4, 36.5], [3.3, 36.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "36", "name": "El Tarf", "arName": "الطارف" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[8.0, 36.7], [8.7, 37.0], [8.9, 36.7], [8.4, 36.5], [8.1, 36.6], [8.0, 36.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "37", "name": "Tindouf", "arName": "تندوف" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-4.8, 27.5], [-1.8, 29.0], [-0.8, 28.0], [-2.8, 26.5], [-5.8, 27.0], [-4.8, 27.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "38", "name": "Tissemsilt", "arName": "تيسمسيلت" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[1.6, 35.7], [2.3, 36.1], [2.6, 35.8], [2.1, 35.5], [1.7, 35.6], [1.6, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "39", "name": "El Oued", "arName": "الوادي" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[6.4, 33.5], [7.7, 34.5], [8.2, 34.0], [7.4, 33.0], [6.6, 33.3], [6.4, 33.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "40", "name": "Khenchela", "arName": "خنشلة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[6.4, 35.2], [7.1, 35.7], [7.4, 35.4], [6.9, 35.0], [6.5, 35.1], [6.4, 35.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "41", "name": "Souk Ahras", "arName": "سوق أهراس" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[7.7, 35.7], [8.4, 36.2], [8.7, 35.9], [8.2, 35.5], [7.8, 35.6], [7.7, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "42", "name": "Tipaza", "arName": "تيبازة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[1.6, 36.4], [2.3, 36.8], [2.9, 36.5], [2.4, 36.1], [1.8, 36.2], [1.6, 36.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "43", "name": "Mila", "arName": "ميلة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[6.0, 35.7], [6.7, 36.2], [7.0, 35.9], [6.5, 35.5], [6.1, 35.6], [6.0, 35.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "44", "name": "Aïn Defla", "arName": "عين الدفلى" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[1.6, 36.4], [2.3, 36.7], [2.8, 36.4], [2.2, 36.0], [1.7, 36.1], [1.6, 36.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "45", "name": "Naâma", "arName": "النعامة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.3, 33.2], [-0.8, 34.2], [-0.3, 33.7], [-1.3, 32.7], [-2.6, 33.0], [-2.3, 33.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "46", "name": "Aïn Témouchent", "arName": "عين تموشنت" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-1.3, 35.5], [-0.6, 35.8], [-0.3, 35.5], [-0.8, 35.3], [-1.4, 35.4], [-1.3, 35.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "47", "name": "Ghardaïa", "arName": "غرداية" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2.0, 32.0], [4.0, 33.0], [4.5, 32.5], [3.5, 31.5], [2.5, 31.8], [2.0, 32.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "48", "name": "Relizane", "arName": "غليزان" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[1.0, 35.7], [1.4, 36.0], [1.7, 35.8], [1.3, 35.5], [1.1, 35.6], [1.0, 35.7]]]
      }
    },

    // Les 10 nouvelles wilayas (créées en 2019)
    {
      "type": "Feature",
      "properties": { "code": "49", "name": "El M'Ghair", "arName": "المغير" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[5.6, 33.8], [6.4, 34.2], [6.8, 33.9], [6.2, 33.5], [5.8, 33.6], [5.6, 33.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "50", "name": "El Meniaa", "arName": "المنيعة" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[1.8, 30.2], [3.2, 30.8], [3.6, 30.4], [2.8, 29.8], [2.0, 30.0], [1.8, 30.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "51", "name": "Ouled Djellal", "arName": "أولاد جلال" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[4.2, 34.0], [5.0, 34.4], [5.4, 34.1], [4.8, 33.7], [4.4, 33.8], [4.2, 34.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "52", "name": "Bordj Baji Mokhtar", "arName": "برج باجي مختار" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0.5, 21.0], [2.5, 22.0], [3.0, 21.5], [2.0, 20.5], [1.0, 20.8], [0.5, 21.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "53", "name": "Béni Abbès", "arName": "بني عباس" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-1.5, 29.5], [-0.2, 30.2], [0.2, 29.8], [-0.8, 29.2], [-1.8, 29.3], [-1.5, 29.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "54", "name": "Timimoun", "arName": "تيميمون" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0.0, 28.5], [1.2, 29.2], [1.6, 28.8], [0.8, 28.2], [0.2, 28.3], [0.0, 28.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "55", "name": "Touggourt", "arName": "تقرت" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[5.8, 32.5], [6.6, 33.0], [7.0, 32.7], [6.4, 32.2], [6.0, 32.3], [5.8, 32.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "56", "name": "Djanet", "arName": "جانت" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[8.8, 24.5], [10.2, 25.5], [10.8, 24.8], [9.8, 23.8], [9.0, 24.2], [8.8, 24.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "57", "name": "In Salah", "arName": "عين صالح" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2.2, 26.0], [3.8, 27.0], [4.2, 26.5], [3.2, 25.5], [2.6, 25.8], [2.2, 26.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "code": "58", "name": "In Guezzam", "arName": "عين قزام" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[5.5, 19.0], [7.0, 20.0], [7.5, 19.5], [6.5, 18.5], [5.8, 18.8], [5.5, 19.0]]]
      }
    }
  ]
} as const;