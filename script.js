let cart = [];
let totalPrice = 0;

// Добавление товара в корзину
function addToCart(productName, productPrice) {
    const existingItemIndex = cart.findIndex(item => item.name === productName);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    totalPrice += productPrice;
    updateCartDisplay();
}

// Обновление отображения корзины
function updateCartDisplay() {
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalQuantity;

    renderCartItems();

    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = totalPrice.toFixed(2);
    
    localStorage.setItem('cartItems', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));
}

// Показ/Скрытие корзины
function toggleCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.style.display = cartItemsDiv.style.display === 'block' ? 'none' : 'block';
}

// Рендеринг товаров корзины
function renderCartItems() {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - ${item.price} ₽
            <span style="margin-left: 10px;">Количество:</span>
            <button onclick="decrementQuantity(${index})">-</button>
            <span id="quantity-${index}">${item.quantity}</span>
            <button onclick="incrementQuantity(${index})">+</button>
            <span style="cursor: pointer;" onclick="removeFromCart(${index})">❌</span>
        `;
        itemsList.appendChild(li);
    });
}

// Увеличение количества товара
function incrementQuantity(index) {
    cart[index].quantity += 1;
    totalPrice += cart[index].price;

    animateQuantityChange(index);
    updateCartDisplay();
}

// Уменьшение количества товара
function decrementQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        totalPrice -= cart[index].price;
    } else {
        removeFromCart(index);
        return;
    }

    animateQuantityChange(index);
    updateCartDisplay();
}

// Анимация изменения количества товара
function animateQuantityChange(index) {
    const quantitySpan = document.getElementById(`quantity-${index}`);
    quantitySpan.classList.add('quantity-animation');
    
    setTimeout(() => {
        quantitySpan.classList.remove('quantity-animation');
    }, 300);
}

// Удаление товара из корзины
function removeFromCart(index) {
    const itemElement = document.querySelector(`#items-list li:nth-child(${index + 1})`);
    
    itemElement.classList.add('item-removal');
    
    setTimeout(() => {
        totalPrice -= cart[index].price * cart[index].quantity;
        cart.splice(index, 1);
        updateCartDisplay();
    }, 500);
}

// Открытие страницы оформления заказа
function openCartInNewTab() {
    if (cart.length === 0) {
        alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
        return;
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));
    
    const newWindow = window.open('checkout.html', '_blank');
    if (!newWindow) {
        alert('Не удалось открыть новую вкладку. Пожалуйста, разрешите всплывающие окна.');
    }
}

// Загрузка данных корзины на странице checkout.html
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalPrice = localStorage.getItem('totalPrice') || 0;

    if (cartItems.length === 0) {
        window.location.href = 'racekit.html';
        return;
    }

    renderCartItemsFromStorage(cartItems, totalPrice);

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Оплата успешно произведена! Спасибо за покупку.');
        localStorage.clear();
        window.location.href = 'confirmation.html';
    });
});

// Рендеринг товаров на странице checkout.html
function renderCartItemsFromStorage(cartItems, totalPrice) {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';

    cartItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - ${item.price} ₽
            <span style="margin-left: 10px;">Количество: ${item.quantity}</span>
        `;
        itemsList.appendChild(li);
    });

    document.getElementById('total-price').textContent = totalPrice;
}
