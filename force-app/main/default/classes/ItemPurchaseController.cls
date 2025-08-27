public with sharing class ItemPurchaseController {

    @AuraEnabled(cacheable=true)
    public static List<String> getItems() {
        // Заглушка: вернём список тестовых товаров
        return new List<String>{ 'Item A', 'Item B', 'Item C' };
    }

    @AuraEnabled
    public static String createPurchase(String itemName) {
        // Заглушка: якобы создаём покупку
        return 'Purchase created for: ' + itemName;
    }
}
