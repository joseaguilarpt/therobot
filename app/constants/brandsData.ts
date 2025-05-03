import { sortBy } from "lodash";

const CARMAKE_DATA = [
  {
    label: "Audi",
    id: "audi",
  },
  {
    label: "BMW",
    id: "bmw",
  },
  {
    label: "Chevrolet",
    id: "chevrolet",
  },
  {
    label: "Ford",
    id: "ford",
  },
  {
    label: "Honda",
    id: "honda",
  },
  {
    label: "Hyundai",
    id: "hyundai",
  },
  {
    label: "Jaguar",
    id: "jaguar",
  },
  {
    label: "Kia",
    id: "kia",
  },
  {
    label: "Land Rover",
    id: "land-rover",
  },
  {
    label: "Lexus",
    id: "lexus",
  },
  {
    label: "Mazda",
    id: "mazda",
  },
  {
    label: "Mercedes-Benz",
    id: "mercedes-benz",
  },
  {
    label: "Nissan",
    id: "nissan",
  },
  {
    label: "Porsche",
    id: "porsche",
  },
  {
    label: "Subaru",
    id: "subaru",
  },
  {
    label: "Tesla",
    id: "tesla",
  },
  {
    label: "Toyota",
    id: "toyota",
  },
  {
    label: "Volkswagen",
    id: "volkswagen",
  },
  {
    label: "Volvo",
    id: "volvo",
  },
];

const CARMODEL_DATA = [
  {
    label: "2 Series",
    id: "bmw-2-series",
  },
  {
    label: "3 Series",
    id: "bmw-3-series",
  },
  {
    label: "4 Series",
    id: "bmw-4-series",
  },
  {
    label: "4Runner",
    id: "toyota-4runner",
  },
  {
    label: "5 Series",
    id: "bmw-5-series",
  },
  {
    label: "7 Series",
    id: "bmw-7-series",
  },
  {
    label: "718 Cayman",
    id: "porsche-718-cayman",
  },
  {
    label: "8 Series",
    id: "bmw-8-series",
  },
  {
    label: "911",
    id: "porsche-911",
  },
  {
    label: "928",
    id: "porsche-928",
  },
  {
    label: "944",
    id: "porsche-944",
  },
  {
    label: "A-Class",
    id: "mercedes-benz-a-class",
  },
  {
    label: "A3",
    id: "audi-a3",
  },
  {
    label: "A4",
    id: "audi-a4",
  },
  {
    label: "A6",
    id: "audi-a6",
  },
  {
    label: "A8",
    id: "audi-a8",
  },
  {
    label: "Accent",
    id: "hyundai-accent",
  },
  {
    label: "Accord",
    id: "honda-accord",
  },
  {
    label: "Altima",
    id: "nissan-altima",
  },
  {
    label: "Armada",
    id: "nissan-armada",
  },
  {
    label: "Arteon",
    id: "volkswagen-arteon",
  },
  {
    label: "Ascent",
    id: "subaru-ascent",
  },
  {
    label: "Atlas",
    id: "volkswagen-atlas",
  },
  {
    label: "BRZ",
    id: "subaru-brz",
  },
  {
    label: "BT-50",
    id: "mazda-bt-50",
  },
  {
    label: "Beetle",
    id: "volkswagen-beetle",
  },
  {
    label: "Blazer",
    id: "chevrolet-blazer",
  },
  {
    label: "Boxster",
    id: "porsche-boxster",
  },
  {
    label: "Bronco",
    id: "ford-bronco",
  },
  {
    label: "C-Class",
    id: "mercedes-benz-c-class",
  },
  {
    label: "C40",
    id: "volvo-c40",
  },
  {
    label: "CLA",
    id: "mercedes-benz-cla",
  },
  {
    label: "CR-V",
    id: "honda-cr-v",
  },
  {
    label: "CX-3",
    id: "mazda-cx-3",
  },
  {
    label: "CX-30",
    id: "mazda-cx-30",
  },
  {
    label: "CX-5",
    id: "mazda-cx-5",
  },
  {
    label: "CX-9",
    id: "mazda-cx-9",
  },
  {
    label: "Camaro",
    id: "chevrolet-camaro",
  },
  {
    label: "Camry",
    id: "toyota-camry",
  },
  {
    label: "Carrera GT",
    id: "porsche-carrera-gt",
  },
  {
    label: "Cayenne",
    id: "porsche-cayenne",
  },
  {
    label: "Civic",
    id: "honda-civic",
  },
  {
    label: "Colorado",
    id: "chevrolet-colorado",
  },
  {
    label: "Corolla",
    id: "toyota-corolla",
  },
  {
    label: "Crosstrek",
    id: "subaru-crosstrek",
  },
  {
    label: "Cybertruck",
    id: "tesla-cybertruck",
  },
  {
    label: "Defender",
    id: "land-rover-defender",
  },
  {
    label: "Discovery",
    id: "land-rover-discovery",
  },
  {
    label: "E-Class",
    id: "mercedes-benz-e-class",
  },
  {
    label: "E-PACE",
    id: "jaguar-e-pace",
  },
  {
    label: "ES",
    id: "lexus-es",
  },
  {
    label: "Edge",
    id: "ford-edge",
  },
  {
    label: "Elantra",
    id: "hyundai-elantra",
  },
  {
    label: "Equinox",
    id: "chevrolet-equinox",
  },
  {
    label: "Escape",
    id: "ford-escape",
  },
  {
    label: "Evoque",
    id: "land-rover-evoque",
  },
  {
    label: "Expedition",
    id: "ford-expedition",
  },
  {
    label: "Explorer",
    id: "ford-explorer",
  },
  {
    label: "F-150",
    id: "ford-f-150",
  },
  {
    label: "F-PACE",
    id: "jaguar-f-pace",
  },
  {
    label: "F-TYPE",
    id: "jaguar-f-type",
  },
  {
    label: "Fit",
    id: "honda-fit",
  },
  {
    label: "Forester",
    id: "subaru-forester",
  },
  {
    label: "Forte",
    id: "kia-forte",
  },
  {
    label: "Freelander",
    id: "land-rover-freelander",
  },
  {
    label: "Frontier",
    id: "nissan-frontier",
  },
  {
    label: "Fusion",
    id: "ford-fusion",
  },
  {
    label: "G-Class",
    id: "mercedes-benz-g-class",
  },
  {
    label: "GLA",
    id: "mercedes-benz-gla",
  },
  {
    label: "GLC",
    id: "mercedes-benz-glc",
  },
  {
    label: "GLE",
    id: "mercedes-benz-gle",
  },
  {
    label: "GLS",
    id: "mercedes-benz-gls",
  },
  {
    label: "GS",
    id: "lexus-gs",
  },
  {
    label: "GX",
    id: "lexus-gx",
  },
  {
    label: "Golf",
    id: "volkswagen-golf",
  },
  {
    label: "HR-V",
    id: "honda-hr-v",
  },
  {
    label: "Highlander",
    id: "toyota-highlander",
  },
  {
    label: "I-PACE",
    id: "jaguar-i-pace",
  },
  {
    label: "ID.4",
    id: "volkswagen-id.4",
  },
  {
    label: "IS",
    id: "lexus-is",
  },
  {
    label: "Impreza",
    id: "subaru-impreza",
  },
  {
    label: "Insight",
    id: "honda-insight",
  },
  {
    label: "Ioniq",
    id: "hyundai-ioniq",
  },
  {
    label: "Jetta",
    id: "volkswagen-jetta",
  },
  {
    label: "Kona",
    id: "hyundai-kona",
  },
  {
    label: "LC",
    id: "lexus-lc",
  },
  {
    label: "LR3",
    id: "land-rover-lr3",
  },
  {
    label: "LR4",
    id: "land-rover-lr4",
  },
  {
    label: "LS",
    id: "lexus-ls",
  },
  {
    label: "LX",
    id: "lexus-lx",
  },
  {
    label: "Legacy",
    id: "subaru-legacy",
  },
  {
    label: "Levorg",
    id: "subaru-levorg",
  },
  {
    label: "MX-30",
    id: "mazda-mx-30",
  },
  {
    label: "MX-5 Miata",
    id: "mazda-mx-5-miata",
  },
  {
    label: "Macan",
    id: "porsche-macan",
  },
  {
    label: "Malibu",
    id: "chevrolet-malibu",
  },
  {
    label: "Maverick",
    id: "ford-maverick",
  },
  {
    label: "Maxima",
    id: "nissan-maxima",
  },
  {
    label: "Mazda2",
    id: "mazda-mazda2",
  },
  {
    label: "Mazda3",
    id: "mazda-mazda3",
  },
  {
    label: "Mazda6",
    id: "mazda-mazda6",
  },
  {
    label: "Model 2",
    id: "tesla-model-2",
  },
  {
    label: "Model 3",
    id: "tesla-model-3",
  },
  {
    label: "Model P",
    id: "tesla-model-p",
  },
  {
    label: "Model Q",
    id: "tesla-model-q",
  },
  {
    label: "Model S",
    id: "tesla-model-s",
  },
  {
    label: "Model X",
    id: "tesla-model-x",
  },
  {
    label: "Model Y",
    id: "tesla-model-y",
  },
  {
    label: "Murano",
    id: "nissan-murano",
  },
  {
    label: "Mustang",
    id: "ford-mustang",
  },
  {
    label: "NX",
    id: "lexus-nx",
  },
  {
    label: "Niro",
    id: "kia-niro",
  },
  {
    label: "Odyssey",
    id: "honda-odyssey",
  },
  {
    label: "Optima",
    id: "kia-optima",
  },
  {
    label: "Outback",
    id: "subaru-outback",
  },
  {
    label: "Palisade",
    id: "hyundai-palisade",
  },
  {
    label: "Panamera",
    id: "porsche-panamera",
  },
  {
    label: "Passat",
    id: "volkswagen-passat",
  },
  {
    label: "Passport",
    id: "honda-passport",
  },
  {
    label: "Pathfinder",
    id: "nissan-pathfinder",
  },
  {
    label: "Pilot",
    id: "honda-pilot",
  },
  {
    label: "Polo",
    id: "volkswagen-polo",
  },
  {
    label: "Prius",
    id: "toyota-prius",
  },
  {
    label: "Q3",
    id: "audi-q3",
  },
  {
    label: "Q5",
    id: "audi-q5",
  },
  {
    label: "Q7",
    id: "audi-q7",
  },
  {
    label: "Q8",
    id: "audi-q8",
  },
  {
    label: "RAV4",
    id: "toyota-rav4",
  },
  {
    label: "RC",
    id: "lexus-rc",
  },
  {
    label: "RX",
    id: "lexus-rx",
  },
  {
    label: "Range Rover",
    id: "land-rover-range-rover",
  },
  {
    label: "Ranger",
    id: "ford-ranger",
  },
  {
    label: "Ridgeline",
    id: "honda-ridgeline",
  },
  {
    label: "Rio",
    id: "kia-rio",
  },
  {
    label: "Roadster",
    id: "tesla-roadster",
  },
  {
    label: "Rogue",
    id: "nissan-rogue",
  },
  {
    label: "S-Class",
    id: "mercedes-benz-s-class",
  },
  {
    label: "S40",
    id: "volvo-s40",
  },
  {
    label: "S60",
    id: "volvo-s60",
  },
  {
    label: "S90",
    id: "volvo-s90",
  },
  {
    label: "Santa Fe",
    id: "hyundai-santa-fe",
  },
  {
    label: "Seltos",
    id: "kia-seltos",
  },
  {
    label: "Semi",
    id: "tesla-semi",
  },
  {
    label: "Sentra",
    id: "nissan-sentra",
  },
  {
    label: "Series I",
    id: "land-rover-series-i",
  },
  {
    label: "Sienna",
    id: "toyota-sienna",
  },
  {
    label: "Silverado",
    id: "chevrolet-silverado",
  },
  {
    label: "Sonata",
    id: "hyundai-sonata",
  },
  {
    label: "Sorento",
    id: "kia-sorento",
  },
  {
    label: "Soul",
    id: "kia-soul",
  },
  {
    label: "Spark",
    id: "chevrolet-spark",
  },
  {
    label: "Sport",
    id: "land-rover-sport",
  },
  {
    label: "Sportage",
    id: "kia-sportage",
  },
  {
    label: "Stinger",
    id: "kia-stinger",
  },
  {
    label: "Suburban",
    id: "chevrolet-suburban",
  },
  {
    label: "TT",
    id: "audi-tt",
  },
  {
    label: "Tacoma",
    id: "toyota-tacoma",
  },
  {
    label: "Tahoe",
    id: "chevrolet-tahoe",
  },
  {
    label: "Taycan",
    id: "porsche-taycan",
  },
  {
    label: "Telluride",
    id: "kia-telluride",
  },
  {
    label: "Tiguan",
    id: "volkswagen-tiguan",
  },
  {
    label: "Titan",
    id: "nissan-titan",
  },
  {
    label: "Touareg",
    id: "volkswagen-touareg",
  },
  {
    label: "Traverse",
    id: "chevrolet-traverse",
  },
  {
    label: "Tucson",
    id: "hyundai-tucson",
  },
  {
    label: "Tundra",
    id: "toyota-tundra",
  },
  {
    label: "V50",
    id: "volvo-v50",
  },
  {
    label: "V60",
    id: "volvo-v60",
  },
  {
    label: "V90",
    id: "volvo-v90",
  },
  {
    label: "Velar",
    id: "land-rover-velar",
  },
  {
    label: "Veloster",
    id: "hyundai-veloster",
  },
  {
    label: "Venue",
    id: "hyundai-venue",
  },
  {
    label: "Versa",
    id: "nissan-versa",
  },
  {
    label: "WRX",
    id: "subaru-wrx",
  },
  {
    label: "X3",
    id: "bmw-x3",
  },
  {
    label: "X5",
    id: "bmw-x5",
  },
  {
    label: "X7",
    id: "bmw-x7",
  },
  {
    label: "XC40",
    id: "volvo-xc40",
  },
  {
    label: "XC60",
    id: "volvo-xc60",
  },
  {
    label: "XC90",
    id: "volvo-xc90",
  },
  {
    label: "XE",
    id: "jaguar-xe",
  },
  {
    label: "XF",
    id: "jaguar-xf",
  },
  {
    label: "XFR",
    id: "jaguar-xfr",
  },
  {
    label: "XJ",
    id: "jaguar-xj",
  },
  {
    label: "XJ220",
    id: "jaguar-xj220",
  },
  {
    label: "XK",
    id: "jaguar-xk",
  },
  {
    label: "XV",
    id: "subaru-xv",
  },
  {
    label: "Yaris",
    id: "toyota-yaris",
  },
  {
    label: "Z4",
    id: "bmw-z4",
  },
  {
    label: "e-tron",
    id: "audi-e-tron",
  },
];

export { CARMAKE_DATA, CARMODEL_DATA };
