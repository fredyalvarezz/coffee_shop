const orders = [
  {
    id: 1,

    customer: "Carlos",

    total: 145,

    status: "completed",

    paymentStatus: "paid",

    createdAt: "2026-07-13",

    items: [
      {
        productId: 1,
        quantity: 2
      },
      {
        productId: 6,
        quantity: 1
      }
    ]
  },

  {
    id:2,

    customer:"Luis",

    total:90,

    status:"preparing",

    paymentStatus:"paid",

    createdAt:"2026-07-14",

    items:[
      {
        productId:4,
        quantity:1
      }
    ]
  }
];

export default orders;