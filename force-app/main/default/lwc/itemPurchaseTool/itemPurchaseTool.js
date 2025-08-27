import { LightningElement , track, wire } from 'lwc';
import getItems from '@salesforce/apex/ItemPurchaseController.getItems';
import createPurchase from '@salesforce/apex/ItemPurchaseController.createPurchase';

export default class ItemPurchaseTool extends LightningElement {
    @track items = [];
    @track cartItems = [];
    @track searchKey = '';
    @track selectedCategory = '';

    // Опции категорий (потом заменим Apex)
    get categoryOptions() {
        return [
            { label: 'All', value: '' },
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Books', value: 'Books' },
            { label: 'Clothes', value: 'Clothes' }
        ];
    }

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Price', fieldName: 'Price__c', type: 'currency' },
        {
            type: 'button',
            typeAttributes: { label: 'Add to Cart', name: 'add_to_cart' }
        }
    ];

    cartColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Quantity', fieldName: 'quantity' }
    ];

    // Выбор категории
    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
        this.loadItems();
    }

    // Поиск
    handleSearchChange(event) {
        this.searchKey = event.target.value;
        this.loadItems();
    }

    // Загрузка товаров через Apex
    loadItems() {
        getItems({ searchKey: this.searchKey, category: this.selectedCategory })
            .then(result => {
                this.items = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Добавление в корзину
    handleAddToCart(event) {
        const itemId = event.detail.row.Id;
        const item = this.items.find(i => i.Id === itemId);

        let existing = this.cartItems.find(c => c.Id === itemId);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.cartItems = [...this.cartItems, { ...item, quantity: 1 }];
        }
    }

    // Оформление покупки
    handleCheckout() {
        createPurchase({ cart: this.cartItems })
            .then(() => {
                this.cartItems = [];
                alert('Purchase created successfully!');
            })
            .catch(error => {
                console.error(error);
            });
    }

    connectedCallback() {
        this.loadItems();
    }
}
