import create from "zustand";
import { devtools } from "zustand/middleware";

const BACKEND_ROOT_URL = `https://majd-mern-e-commerce.herokuapp.com`;

const useStore = create(
  devtools((set, get) => ({
    modalMessage: null,
    sidebar: false,
    userMenu: false,
    cartState: false,
    userInfo: {},
    loading: false,
    products: [],
    cartProducts: [],
    carouselProducts: [],
    orders: [],
    adminUsers: [],
    adminOrders: [],

    jsonHeaders: () => ({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${get().userInfo.token}`,
      },
    }),

    multipartHeaders: () => ({
      headers: {
        Authorization: `Bearer ${get().userInfo.token}`,
      },
    }),

    loginAsGuest: () => {
      fetch(`${BACKEND_ROOT_URL}/api/users/guest`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().setUserInfo({
              token: res.token,
              role: res.role,
              name: res.name,
              email: res.email,
            });
            window.location.href = "/";
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    subscribeToNewsletter: (email) => {
      fetch(`${BACKEND_ROOT_URL}/api/customer-services/newsletter`, {
        ...get().jsonHeaders(),
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 201) {
            return get().showModal(res.message);
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    reportProduct: (name, message) => {
      fetch(`${BACKEND_ROOT_URL}/api/customer-services/report`, {
        ...get().jsonHeaders(),
        method: "POST",
        body: JSON.stringify({
          name,
          message,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 201) {
            return get().showModal(res.message);
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    contactUs: (name, email, message) => {
      fetch(`${BACKEND_ROOT_URL}/api/customer-services/contact-us`, {
        ...get().jsonHeaders(),
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 201) {
            return get().showModal(res.message);
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    addReview: (productId, rating, comment) => {
      console.log(productId);
      fetch(`${BACKEND_ROOT_URL}/api/products/${productId}/review`, {
        ...get().jsonHeaders(),
        method: "PUT",
        body: JSON.stringify({
          rating,
          comment,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 201) {
            return get().showModal(res.message);
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    fetchOrders: () => {
      fetch(`${BACKEND_ROOT_URL}/api/orders`, {
        ...get().jsonHeaders(),
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            return set({ orders: res._orders });
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    updateProfile: (name, email, password) => {
      fetch(`${BACKEND_ROOT_URL}/api/users/profile`, {
        ...get().jsonHeaders(),
        method: "PUT",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            return get().showModal(res.message);
          }

          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    placeOrder: (paymentMethod, address, city, postalCode, country) => {
      let selectedProducts;
      try {
        selectedProducts = JSON.parse(localStorage.getItem("cartProducts"));
      } catch (error) {
        localStorage.setItem("cartProducts", "[]");
        get().showModal("error occurred, please, select again your products!");
      }

      return fetch(`${BACKEND_ROOT_URL}/api/orders`, {
        ...get().jsonHeaders(),
        method: "POST",
        body: JSON.stringify({
          products: selectedProducts,
          payment_method: paymentMethod,
          shipping_address: `${(address, city, postalCode, country)}`,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 201) {
            get().showModal(res.message);
            localStorage.setItem("cartProducts", "[]");
            set({ cartProducts: [] });
            return true;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    changePassword: (token, password, confirmPassword) => {
      fetch(`${BACKEND_ROOT_URL}/api/users/reset/${token}`, {
        ...get().jsonHeaders(),
        method: "PUT",
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            return get().showModal(res.message);
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    requestPasswordReset: (email) => {
      fetch(`${BACKEND_ROOT_URL}/api/users/reset`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 201) {
            get().showModal(res.message);
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    addNewProduct: (name, price, countInStock, description, image) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("countInStock", countInStock);
      formData.append("description", description);

      set({ loading: true });

      return fetch(`${BACKEND_ROOT_URL}/api/products`, {
        ...get().multipartHeaders(),
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          set({ loading: false });
          if (res.status === 201) {
            get().fetchProducts();
            get().showModal(res.message);
            return true;
          }
          if (res.status === 401 || res.status === 403) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          set({ loading: false });
          get().showModal(err.error);
        });
    },

    updateProduct: (
      productId,
      name,
      price,
      countInStock,
      description,
      image
    ) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("countInStock", countInStock);
      formData.append("description", description);

      set({ loading: true });

      fetch(`${BACKEND_ROOT_URL}/api/products/${productId}`, {
        ...get().multipartHeaders(),
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          set({ loading: false });
          if (res.status === 200) {
            get().fetchProducts();
            get().showModal(res.message);

            return;
          }
          if (res.status === 401 || res.status === 403) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          set({ loading: false });
          get().showModal(err.error);
        });
    },

    deleteProduct: (productId) => {
      fetch(`${BACKEND_ROOT_URL}/api/products/${productId}`, {
        ...get().jsonHeaders(),
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().fetchProducts();
            get().showModal(res.result);
            return;
          }
          if (res.status === 403) {
            get().showModal(res.error);
            return;
          }
          if (res.status === 401) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    fetchProducts: (keyword) => {
      fetch(`${BACKEND_ROOT_URL}/api/products?keyword=${keyword || ""}`, {
        ...get().jsonHeaders(),
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            return set({ products: res._products });
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    deleteCarouselImage: (imageId) => {
      fetch(`${BACKEND_ROOT_URL}/api/products/carousel/${imageId}`, {
        ...get().jsonHeaders(),
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().fetchCarouselProducts();
            get().showModal(res.result);
            return;
          }
          if (res.status === 403) {
            get().showModal(res.error);
            return;
          }
          if (res.status === 401) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    uploadCarouselImage: (file) => {
      const formData = new FormData();
      formData.append("image", file);
      set({ loading: true });

      fetch(`${BACKEND_ROOT_URL}/api/products/carousel`, {
        ...get().multipartHeaders(),
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          set({ loading: false });
          if (res.status === 201) {
            get().showModal(res.message);
            get().fetchCarouselProducts();
            return;
          }
          if (res.status === 401 || res.status === 403) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          set({ loading: false });
          get().showModal(err.error);
        });
    },

    fetchCarouselProducts: () => {
      fetch(`${BACKEND_ROOT_URL}/api/products/carousel`, {
        ...get().jsonHeaders(),
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            return set({ carouselProducts: res._products });
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    updateUserOrder: (orderId, delivered) => {
      fetch(`${BACKEND_ROOT_URL}/api/orders/admin/${orderId}`, {
        ...get().jsonHeaders(),
        method: "PUT",
        body: JSON.stringify({
          delivered,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().fetchAdminOrders();
            get().showModal(res.result);
            return;
          }
          if (res.status === 401 || res.status === 403) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    fetchAdminOrders: () => {
      fetch(`${BACKEND_ROOT_URL}/api/orders/admin`, {
        ...get().jsonHeaders(),
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            return set({ adminOrders: res._orders });
          }
          if (res.status === 401 || res.status === 403) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    updateUserRole: (userId, role) => {
      fetch(`${BACKEND_ROOT_URL}/api/users/${userId}`, {
        ...get().jsonHeaders(),
        method: "PUT",
        body: JSON.stringify({
          userId,
          role: role,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().fetchUsers();
            get().showModal(res.result);
            return;
          }
          if (res.status === 403) {
            get().showModal(res.error);
            return;
          }
          if (res.status === 401) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    deleteUser: (userId) => {
      fetch(`${BACKEND_ROOT_URL}/api/users/${userId}`, {
        ...get().jsonHeaders(),
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().fetchUsers();
            get().showModal(res.result);
            return;
          }
          if (res.status === 401 || res.status === 403) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    fetchUsers: () => {
      fetch(`${BACKEND_ROOT_URL}/api/users`, {
        ...get().jsonHeaders(),
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            return set({ adminUsers: res._users });
          }
          if (res.status === 401 || res.status === 403) {
            get().showModal("Not authorized");
            get().logout();
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    signIn: (email, password) => {
      fetch(`${BACKEND_ROOT_URL}/api/users/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().setUserInfo({
              token: res.token,
              role: res.role,
              name: res.name,
              email: res.email,
            });
            window.location.href = "/";
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    signUp: (name, email, password) => {
      fetch(`${BACKEND_ROOT_URL}/api/users/signup`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            get().setUserInfo({
              token: res.token,
              role: res.role,
              name: res.name,
              email: res.email,
            });
            window.location.href = "/";
            return;
          }
          get().showModal(res.error);
        })
        .catch((err) => {
          get().showModal(err.error);
        });
    },

    logout: () => {
      get().setUserInfo({});
      window.location.href = "/";
    },

    loggedIn: () => {
      const userInfo = get().userInfo;
      if (userInfo) return userInfo.token;
      return null;
    },
    userRole: () => {
      const userInfo = get().userInfo;
      if (userInfo) return userInfo.role;
      return null;
    },

    setUserInfo: (userInfo) => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      set({ userInfo: userInfo });
    },

    numOfProducts: () => get().cartProducts.length,

    productById: (productId) =>
      get().products.filter(({ _id }) => _id === productId)[0],

    totalPrice: () =>
      get()
        .cartProducts.map(({ price, quantity }) => price * quantity)
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2),

    showModal: (errorMessage) => set({ modalMessage: errorMessage }),
    removeModal: () => set({ modalMessage: null }),
    closeSidebar: () => set({ sidebar: false }),
    openSidebar: () => set({ sidebar: true }),
    setSidebar: () => set((state) => ({ sidebar: !state.sidebar })),
    openCloseUserMenu: () => set((state) => ({ userMenu: !state.userMenu })),
    closeUserMenuAndSidebar: () => set({ sidebar: false, userMenu: false }),
    openCart: () => set({ cartState: true }),
    closeCart: () => set({ cartState: false }),
    addProductsToCart: (products) => set({ cartProducts: products }),

    addProductToCart: ({ _id, name, image_url, price, quantity }) => {
      const updatedCartProducts = [
        ...get().cartProducts,
        { _id, name, image_url, price, quantity },
      ];
      set({
        cartProducts: updatedCartProducts,
      });
      localStorage.setItem("cartProducts", JSON.stringify(updatedCartProducts));
    },

    removeProductFromCart: (_id) => {
      const updatedCartProducts = get().cartProducts.filter(
        (product) => product._id !== _id
      );
      set({
        cartProducts: updatedCartProducts,
      });
      localStorage.setItem("cartProducts", JSON.stringify(updatedCartProducts));
    },

    isExistInCart: (productId) =>
      get().cartProducts.find(({ _id }) => _id === productId),

    updateProductQuantity: (prodId, newQuantity) => {
      const updatedCartProducts = get().cartProducts;
      var foundIndex = get().cartProducts.findIndex(
        ({ _id }) => _id === prodId
      );
      updatedCartProducts[foundIndex].quantity = newQuantity;
      set({
        cartProducts: updatedCartProducts,
      });
      localStorage.setItem("cartProducts", JSON.stringify(updatedCartProducts));
    },
  }))
);

export default useStore;
