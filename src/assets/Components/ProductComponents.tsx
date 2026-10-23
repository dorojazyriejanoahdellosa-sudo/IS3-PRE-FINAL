import React, { useState} from 'react';
import './ProductComponents.css';

type Burger = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  image: string;
};

type BurgerForm = Omit<Burger, 'id'>;
type Page = 'home' | 'about' | 'menu' | 'contact' | 'cart';

const initialBurgers: Burger[] = [
  {
    id: 1,
    name: 'Cheesy Tomato Burger',
    category: 'Beef Burgers',
    description: 'A delicious beef burger with fresh lettuce, tomato, and cheese.',
    price: 99.15,
    rating: 5,
    stock: 20,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH2CfI49_n4Jgab5hJS0dnefd-VNU-_IikmO1CJcICffIoV6GR9vIpRupg&s=1000',
  },
  {
    id: 2,
    name: 'Classic Burger',
    category: 'Beef Burgers',
    description: 'A classic beef burger with fresh lettuce and a flavorful sauce.',
    price: 98.25,
    rating: 4,
    stock: 3,
    image: 'https://www.southernliving.com/thmb/L-gmCs95kA6SkYJVtPmTZPs5DpA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/28284_GS_Burgers272-8af891887d074409a352ff7e304520f0.jpg',
  },
  {
    id: 3,
    name: ' Crispy Chicken Burger',
    category: 'Chicken Burgers',
    description: 'Chicken breast, chilli sauce, tomatoes, pickles, coleslaw.',
    price: 95.25,
    rating: 3,
    stock: 10,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd3FIqyqrvBTaMwfWfBNT5rcLJ_m4uvtldBuPdEhSGWl_A0mL2dv3ySRdg&s=1000',
  },
  {
    id: 4,
    name: 'Ultimate Bacon Burger',
    category: 'Beef Burgers',
    description: 'House patty, cheddar cheese, bacon, onion, mustard.',
    price: 95.33,
    rating: 4,
    stock: 15,
    image: 'https://i.pinimg.com/736x/c0/5d/88/c05d8880c470d922251801597da5246b.jpg',
  },
];

const emptyForm: BurgerForm = {
  name: '',
  category: '',
  description: '',
  price: 0,
  rating: 5,
  stock: 0,
  image: '',
};

export default function ProductComponent() {
  const [burgers, setBurgers] = useState(initialBurgers);
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
  const [category, setCategory] = useState('All Categories');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [form, setForm] = useState(emptyForm);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const cartCount = Object.values(quantities).reduce((total, quantity) => total + quantity, 0);
  const categories = ['All Categories', ...new Set(burgers.map((burger) => burger.category))];
  const visibleBurgers =
    category === 'All Categories'
      ? burgers
      : burgers.filter((burger) => burger.category === category);

  function changeQuantity(id: number, amount: number, stock: number) {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(stock, (current[id] ?? 0) + amount)),
    }));
  }

  function addBurger(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newBurger = { ...form, id: Date.now() };
    setBurgers((current) => [...current, newBurger]);
    setForm(emptyForm);
    setShowAddProduct(false);
  }

  function updateForm(key: keyof BurgerForm, value: string, isNumber: boolean) {
    setForm((current) => ({
      ...current,
      [key]: isNumber ? Number(value) : value,
    }));
  }

  return (
    <>
      {page !== 'home' && <header className="header">
        <button className="brand" type="button" onClick={() => setPage('home')} aria-label="Tasty Burger home">
          <span className="brand-mark" aria-hidden="true">🍔</span>
          <span> TASTY BURGER </span>
        </button>
        <nav className="navigation" aria-label="Main navigation">
          <button type="button" onClick={() => setPage('about')}>ABOUT</button>
          <button type="button" onClick={() => setPage('menu')}>OUR MENU</button>
          <button type="button" onClick={() => setPage('contact')}>CONTACT</button>
          <button
            type="button"
            onClick={() => {
              setPage('menu');
              setShowAddProduct((visible) => !visible);
            }}
          >
            ADD NEW PRODUCT
          </button>
          <button
            className="cart-button"
            type="button"
            onClick={() => setPage('cart')}
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <span aria-hidden="true">&#128722;</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </nav>
      </header>}

      <main className="burger-page" id="top">
        {page === 'home' && (
          <section className="front-page">
            <p className="front-page-eyebrow">TASTY BURGER</p>
            <h1>Big flavor. Fresh burgers.</h1>
            <p>Juicy patties, bold toppings, and a burger for every craving.</p>
            <button className="front-page-button" type="button" onClick={() => setPage('menu')}>
              Our Menu
            </button>
          </section>
        )}
        {page === 'about' && (
          <section className="content-page">
            <h1>About Tasty Burger</h1>
            <p>We make fresh, flavorful burgers with juicy patties, bold toppings, and ingredients picked for great taste.</p>
          </section>
        )}
        {page === 'contact' && (
          <section className="content-page">
            <h1>Contact Us</h1>
            <p>Questions about our burgers? We’d love to hear from you.</p>
            <p>Email: hello@tastyburger.com</p>
          </section>
        )}
        {page === 'cart' && (
          <section className="content-page cart-page">
            <h1>Your Cart</h1>
            {cartCount === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-items">
                  {burgers
                    .filter((burger) => (quantities[burger.id] ?? 0) > 0)
                    .map((burger) => {
                      const quantity = quantities[burger.id] ?? 0;
                      return (
                        <div className="cart-item" key={burger.id}>
                          <img src={burger.image} alt="" />
                          <div className="cart-item-info">
                            <h2>{burger.name}</h2>
                            <p>Quantity: {quantity}</p>
                            <p>Subtotal: ${(burger.price * quantity).toFixed(2)}</p>
                          </div>
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() => changeQuantity(burger.id, -1, burger.stock)}
                              aria-label={`Remove one ${burger.name}`}
                            >
                              −
                            </button>
                            <span>{quantity}</span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(burger.id, 1, burger.stock)}
                              disabled={quantity === burger.stock}
                              aria-label={`Add one ${burger.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <p className="cart-total">
                  Total: ${burgers.reduce(
                    (total, burger) => total + burger.price * (quantities[burger.id] ?? 0),
                    0,
                  ).toFixed(2)}
                </p>
              </>
            )}
            <button className="details-button continue-shopping" type="button" onClick={() => setPage('menu')}>
              Continue to Menu
            </button>
          </section>
        )}
        {page === 'menu' && <>
        <div className="products-heading">
          <div>
            <h1>Our Crazy Burgers</h1>
            <p className="main-subtitle">
              Get ready for a wild ride of flavors! Our crazy burgers are loaded with juicy
              patties, bold toppings, and irresistible sauces, all stacked on a perfectly toasted
              bun. Whether you like it cheesy, or extra meaty, we've got a burger that will blow
              your mind!
            </p>
          </div>
          <label className="category-filter">
            <span className="visually-hidden">Filter burgers by category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="burger-list" id="menu">
          {visibleBurgers.map((burger) => (
            <div key={burger.id} className="burger-card">
              <img src={burger.image} alt={burger.name} className="burger-image" />
              <div className="burger-info">
                <span className="burger-category">{burger.category}</span>
                <h2>{burger.name}</h2>
                <div className="burger-price">${burger.price.toFixed(2)}</div>
                <p className="card-rating">Rating: <span aria-hidden="true">⭐</span> {burger.rating}/5</p>
                <p>Availability: {burger.stock}</p>
                {burger.stock <= 3 && <p className="low-stock">Low availability!</p>}
                <p>
                  Subtotal: ${(burger.price * (quantities[burger.id] ?? 0)).toFixed(2)}
                </p>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => changeQuantity(burger.id, -1, burger.stock)}
                    disabled={(quantities[burger.id] ?? 0) === 0}
                    aria-label={`Remove one ${burger.name}`}
                  >
                    −
                  </button>
                  <span>{quantities[burger.id] ?? 0}</span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(burger.id, 1, burger.stock)}
                    disabled={(quantities[burger.id] ?? 0) === burger.stock}
                    aria-label={`Add one ${burger.name}`}
                  >
                    +
                  </button>
                </div>
                <div className="burger-meta">
                  <button
                    className="details-button"
                    type="button"
                    onClick={() => setSelectedBurger(burger)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showAddProduct && <section className="add-product-section" id="add-product">
          <div className="add-product-heading">
            <h2>Add New Product</h2>
            <button
              className="add-product-close"
              type="button"
              onClick={() => setShowAddProduct(false)}
              aria-label="Close add product form"
            >
              ×
            </button>
          </div>
          <form className="add-product-form" onSubmit={addBurger}>
            <label>
              Feature Image URL
              <input
                type="url"
                value={form.image}
                onChange={(event) => updateForm('image', event.target.value, false)}
                required
              />
            </label>
            <label>
              Product Name
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value, false)}
                required
              />
            </label>
            <label>
              Product Category
              <input
                type="text"
                value={form.category}
                onChange={(event) => updateForm('category', event.target.value, false)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value, false)}
                required
              />
            </label>
            <label>
              Rating (1–5)
              <input
                type="number"
                min={1}
                max={5}
                step={1}
                value={form.rating}
                onChange={(event) => updateForm('rating', event.target.value, true)}
                required
              />
            </label>
            <label>
              Price
              <input
                type="number"
                min={0.01}
                step={0.01}
                value={form.price || ''}
                onChange={(event) => updateForm('price', event.target.value, true)}
                required
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                min={0}
                step={1}
                value={form.stock}
                onChange={(event) => updateForm('stock', event.target.value, true)}
                required
              />
            </label>
            <button className="details-button" type="submit">Add Product</button>
          </form>
        </section>}
        </>}
      </main>
      {selectedBurger && (
        <div
          className="details-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedBurger(null);
          }}
        >
          <section
            className="details-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-title"
          >
            <div className="details-header">
              <h2>Burger details</h2>
              <button
                className="details-close"
                type="button"
                onClick={() => setSelectedBurger(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <div className="details-content">
              <img src={selectedBurger.image} alt={selectedBurger.name} />
              <div className="details-info">
              <span className="details-category">{selectedBurger.category}</span>
              <h3 id="details-title">{selectedBurger.name}</h3>
                <strong className="details-price">${selectedBurger.price.toFixed(2)}</strong>
                <div className="details-description">
                  <strong>Description</strong>
                  <p>{selectedBurger.description}</p>
                </div>
                <div className="details-rating">
                  <strong>Rating</strong>
                  <span>
                    <span aria-hidden="true">⭐</span> {selectedBurger.rating}/5
                  </span>
                </div>
                <p className="details-stock">Availability: {selectedBurger.stock}</p>
                <button
                  className="details-cart-button"
                  type="button"
                  onClick={() => changeQuantity(selectedBurger.id, 1, selectedBurger.stock)}
                  disabled={(quantities[selectedBurger.id] ?? 0) === selectedBurger.stock}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
