# Cart System Implementation for Shopping App

## Current Progress
✅ Plan approved by user

## Remaining Steps
1. [✅] Update src/AppRouter.jsx: 
   - Add cart state with localStorage load/save (like wishlist).
   - Implement addToCart logic: check if exists (increment qty or "Already in cart" toast), else add with qty:1.
   - Dynamic toast: {show, message} e.g. "Added {name}", "Incremented {name}", "Already in cart".
   - Add removeFromCart(id), updateQuantity(id, qty).
   - Pass cart, removeFromCart etc. to Home/Categories props.

2. [✅] Update src/components/CartToast.jsx: 
   - Use cartToast.message in span.

3. [✅] Read src/pages/Categories.jsx (confirm structure like Home).

4. [✅] Update src/pages/Home.jsx: 
   - Add cart UI section (e.g. show cart length badge).
   - Add category filter for cart items.
   - Render filtered cart items with ProductCard (modify for cart mode? or new component), add remove qty buttons.

5. [✅] Update src/pages/Categories.jsx similarly.

6. [✅] Test: 
   - `npm run dev` running, changes complete - cart storage in localStorage, dynamic toast text ("Added...", "already in cart - quantity incremented!"), cart filtering by category in Home/Categories with remove buttons.

7. [ ] Complete task.
