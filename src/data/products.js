const products = [
    {
        id: 1,
        title: "Latte",
        basePrice: 45,
        category: "calientes",
        image: "/cafe1.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            flavors: ["regular", "avellana", "vainilla", "caramelo"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 2,
        title: "Capuccino",
        basePrice: 55,
        category: "calientes",
        image: "/cafe2.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            flavors: ["regular", "avellana", "vainilla", "caramelo"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 3,
        title: "Iced Latte",
        basePrice: 55,
        category: "frias",
        image: "/cafe3.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            flavors: ["regular", "avellana", "vainilla", "caramelo"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 4,
        title: "Frappé Mocha",
        basePrice: 55,
        category: "frappes",
        image: "/cafe4.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 5,
        title: "Pumpkin Latte",
        basePrice: 55,
        category: "temporada",
        image: "/cafe5.jpg",
        stock: false,
        customizable: true,
        options: {
            styles: ["caliente", "frio", "frappe"],
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },

    {
        id: 6,
        title: "Espresso",
        basePrice: 25,
        category: "calientes",
        image: "/espresso.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["solo", "doble"]
        },
    },
    {
        id: 7,
        title: "Americano",
        basePrice: 30,
        category: "calientes",
        image: "/americano.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"]
        }
    },
    {
        id: 8,
        title: "Mocha",
        basePrice: 55,
        category: "calientes",
        image: "/mocha.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 9,
        title: "Chai Latte",
        basePrice: 55,
        category: "calientes",
        image: "/chai.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 10,
        title: "Taro Latte",
        basePrice: 55,
        category: "calientes",
        image: "/taro.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 11,
        title: "Iced Americano",
        basePrice: 55,
        category: "frias",
        image: "/icedamericano.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
        }
    },
    {
        id: 12,
        title: "Cold Brew",
        basePrice: 55,
        category: "frias",
        image: "/coldbrew.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
        }
    },
    {
        id: 13,
        title: "Iced Mocha",
        basePrice: 55,
        category: "frias",
        image: "/icedmocha.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 14,
        title: "Frappé Caramelo",
        basePrice: 55,
        category: "frappes",
        image: "/frappecaramelo.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 15,
        title: "Frappé Vainilla",
        basePrice: 55,
        category: "frappes",
        image: "/frappevainilla.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 16,
        title: "Frappé Oreo",
        basePrice: 55,
        category: "frappes",
        image: "/frappeoreo.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 17,
        title: "Frappé Mazapan",
        basePrice: 55,
        category: "frappes",
        image: "/frappemazapan.jpg",
        stock: true,
        customizable: true,
        options: {
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 18,
        title: "Peppermint Mocha",
        basePrice: 55,
        category: "temporada",
        image: "/Peppermintmocha.jpg",
        stock: true,
        customizable: true,
        options: {
            styles: ["caliente", "frio", "frappe"],
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },
    {
        id: 19,
        title: "Cherry Mocha",
        basePrice: 55,
        category: "temporada",
        image: "/Cherrymocha.jpg",
        stock: true,
        customizable: true,
        options: {
            styles: ["caliente", "frio", "frappe"],
            sizes: ["chico", "mediano", "grande"],
            milks: ["entera", "deslactosada", "light", "almendra", "avena", "coco"]
        }
    },

];

export default products;