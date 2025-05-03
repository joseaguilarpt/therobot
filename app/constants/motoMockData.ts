export interface Motorcycle {
    id: number;
    make: string;
    model: string;
    year: number;
    category: string;
    price: number;
    mileage: number;
    color: string;
    description: string;
    features: string[];
    location: string;
    lat: number;
    lon: number;
    updated_at: Date;
    updated_by: string;
    email: string;
    phone: string;
    promotional?: boolean; // Optional boolean field for promotional listing
  }
  
  // Sample data for creativity
  const motorcycleData = {
    "Harley-Davidson": {
      models: ["Street 750", "Iron 883", "Fat Boy", "Street Glide", "Sportster S", "Road King", "Heritage Classic", "Electra Glide", "Pan America", "LiveWire"],
      categories: ["Cruiser", "Touring", "Electric"]
    },
    "Honda": {
      models: ["CB500X", "CRF450R", "Gold Wing", "Africa Twin", "CBR600RR", "Rebel 500", "Grom", "Shadow Phantom", "CB650R", "XR650L"],
      categories: ["Adventure", "Sport", "Cruiser"]
    },
    "Yamaha": {
      models: ["MT-07", "YZF-R3", "Tenere 700", "Bolt R-Spec", "Tracer 900", "YZ250F", "FJR1300", "XSR900", "V Star 250", "Super Tenere"],
      categories: ["Sport", "Adventure", "Cruiser"]
    },
    "Kawasaki": {
      models: ["Ninja 400", "Z650", "Versys 650", "Vulcan S", "Z900", "Ninja H2", "KLR650", "Concours 14", "Versys-X 300", "W800"],
      categories: ["Sport", "Adventure", "Cruiser"]
    },
    "BMW": {
      models: ["R 1250 GS", "S 1000 RR", "F 850 GS", "K 1600 GTL", "G 310 R", "R nineT", "F 900 R", "R 18", "C 400 X", "S 1000 XR"],
      categories: ["Adventure", "Sport", "Touring"]
    },
    "Ducati": {
      models: ["Panigale V4", "Scrambler Icon", "Monster", "Multistrada V4", "Diavel 1260", "SuperSport", "Streetfighter V4", "Hypermotard", "DesertX", "XDiavel"],
      categories: ["Sport", "Adventure", "Cruiser"]
    },
    "Triumph": {
      models: ["Street Triple", "Tiger 900", "Bonneville T120", "Rocket 3", "Scrambler 1200", "Daytona Moto2", "Speed Triple", "Thruxton RS", "Tiger Sport 660", "Bobber"],
      categories: ["Sport", "Adventure", "Classic"]
    },
    "Suzuki": {
      models: ["GSX-R600", "V-Strom 650", "Boulevard M109R", "DR-Z400S", "SV650", "Hayabusa", "Katana", "RM-Z450", "Burgman 400", "GSX-S750"],
      categories: ["Sport", "Adventure", "Cruiser"]
    },
    "KTM": {
      models: ["Duke 390", "1290 Super Adventure", "250 SX-F", "790 Adventure", "500 EXC-F", "890 Duke R", "RC 390", "690 Enduro R", "450 SX-F", "790 Adventure R"],
      categories: ["Sport", "Adventure", "Enduro"]
    },
    "Indian": {
      models: ["Scout", "Chief", "FTR 1200", "Chieftain", "Roadmaster", "Springfield", "Vintage", "Challenger", "Scout Bobber", "Super Chief"],
      categories: ["Cruiser", "Touring", "Sport"]
    },
    "Aprilia": {
      models: ["RS 660", "Tuono V4", "Shiver 900", "Dorsoduro 900", "Tuareg 660", "Tuono 660", "RSV4", "Mana 850", "Caponord 1200", "SX 125"],
      categories: ["Sport", "Adventure", "Naked"]
    },
    "Husqvarna": {
      models: ["Svartpilen 401", "Vitpilen 701", "701 Enduro", "701 Supermoto", "Norden 901", "TC 125", "FE 501", "TX 300", "TE 150", "FC 450"],
      categories: ["Sport", "Adventure", "Enduro"]
    },
    "Moto Guzzi": {
      models: ["V7", "V9 Bobber", "V85 TT", "California", "MGX-21", "Eldorado", "Griso", "Norge", "Audace", "Le Mans"],
      categories: ["Classic", "Adventure", "Cruiser"]
    },
    "Royal Enfield": {
      models: ["Classic 350", "Interceptor 650", "Himalayan", "Continental GT", "Meteor 350", "Bullet 500", "Thunderbird 350", "Scram 411", "Hunter 350", "650 Twin"],
      categories: ["Classic", "Adventure", "Cruiser"]
    },
    "Victory": {
      models: ["Vegas", "Cross Country", "Octane", "Magnum", "Gunner", "Judge", "Vision", "Hammer", "High-Ball", "Kingpin"],
      categories: ["Cruiser", "Touring", "Sport"]
    },
    "Benelli": {
      models: ["TNT 300", "TRK 502", "Leoncino 500", "302S", "502C", "Imperiale 400", "BN 600i", "302R", "752S", "TNT 600"],
      categories: ["Sport", "Adventure", "Naked"]
    },
    "MV Agusta": {
      models: ["F3 800", "Brutale 800", "Dragster 800", "Turismo Veloce", "Superveloce", "Rush 1000", "F4", "Rivale", "Stradale", "Brutale 1000"],
      categories: ["Sport", "Adventure", "Naked"]
    },
    "Bajaj": {
      models: ["Pulsar 150", "Dominar 400", "Avenger 220", "Discover 125", "CT 100", "Platina 110", "Pulsar NS200", "Pulsar RS200", "Pulsar 125", "V15"],
      categories: ["Sport", "Cruiser", "Commuter"]
    },
    "Hero": {
      models: ["Splendor Plus", "HF Deluxe", "Glamour", "XPulse 200", "Xtreme 160R", "Maestro Edge", "Pleasure Plus", "Destini 125", "Passion Pro", "Super Splendor"],
      categories: ["Sport", "Cruiser", "Commuter"]
    },
    "Kymco": {
      models: ["AK 550", "Xciting S 400i", "People S 150", "Super 8 150", "Agility 125", "Like 150i", "Downtown 350i", "K-Pipe 125", "Mongoose 270", "UXV 450i"],
      categories: ["Scooter", "Sport", "Commuter"]
    }
  };
  
  const motorcycleColors = ["Red", "Blue", "Black", "White", "Silver", "Gray", "Green", "Yellow"];
  const featuresOptions = [
    ["ABS", "Traction Control", "Heated Grips"],
    ["LED Lights", "Quick Shifter", "Slipper Clutch"],
    ["Bluetooth Connectivity", "Navigation System", "Cruise Control"],
    ["Adjustable Suspension", "Windshield", "Luggage Rack"],
    ["Riding Modes", "Cornering ABS", "Smartphone Integration"]
  ];
  
  const locations = [
    { name: "San José, Costa Rica", lat: 9.9281, lon: -84.0907 },
    { name: "Alajuela, Costa Rica", lat: 10.0153, lon: -84.2140 },
    { name: "Cartago, Costa Rica", lat: 9.8644, lon: -83.9194 },
    { name: "Heredia, Costa Rica", lat: 9.9988, lon: -84.1165 },
    { name: "Liberia, Costa Rica", lat: 10.6340, lon: -85.4400 },
    { name: "Puntarenas, Costa Rica", lat: 9.9763, lon: -84.8384 },
    { name: "Limon, Costa Rica", lat: 9.9907, lon: -83.0360 },
    { name: "Quepos, Costa Rica", lat: 9.4312, lon: -84.1619 },
    { name: "Tamarindo, Costa Rica", lat: 10.2993, lon: -85.8371 },
    { name: "Jaco, Costa Rica", lat: 9.6142, lon: -84.6283 }
  ];
  
  // Generate an array of 100 creative motorcycle listings
  const motorcycles: Motorcycle[] = [];
  
  // Helper function to get a random element from an array
  function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  
  // Function to generate random date between two dates
  const getRandomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  // Generate 100 motorcycle listings
  for (let i = 0; i < 100; i++) {
    const make = getRandomElement(Object.keys(motorcycleData));
    const model = getRandomElement(motorcycleData[make].models);
    const category = getRandomElement(motorcycleData[make].categories);
    const location = getRandomElement(locations);
    const motorcycleListing: Motorcycle = {
      id: i + 1,
      make: make,
      model: model,
      year: getRandomInt(2000, 2024),
      category: category,
      price: getRandomInt(3000, 30000),
      mileage: getRandomInt(0, 50000),
      color: getRandomElement(motorcycleColors),
      description: `A reliable and stylish ${make} ${model} ${category} motorcycle ready for your next adventure.`,
      features: getRandomElement(featuresOptions),
      location: location.name,
      lat: location.lat,
      lon: location.lon,
      updated_at: getRandomDate(new Date(2024, 0, 1), new Date()), // Random date between 2024-01-01 and current date
      updated_by: "Dealer",
      email: `contact${i + 1}@motorcycledlr.com`,
      phone: `+506 8${Math.floor(Math.random() * 1000000)}`,
    };
  
    // Randomly assign promotional motorcycle listings (60% chance)
    if (Math.random() < 0.6) {
      motorcycleListing.promotional = true;
    }
  
    motorcycles.push(motorcycleListing);
  }
  
  // Helper functions for generating random values
  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Output or further usage of motorcycles array
  export default motorcycles;
  