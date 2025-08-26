public with sharing class ItemPurchaseController {
    @AuraEnabled(cacheable=true)
    public static List<Item__c> getItems(String searchKey, String category) {
        String query = 'SELECT Id, Name, Price__c, Category__c FROM Item__c WHERE Name LIKE :(\'%\' + searchKey + \'%\')';
        if (String.isNotBlank(category)) {
            query += ' AND Category__c = :category';
        }
        return Database.query(query);
    }

    @AuraEnabled
    public static void createPurchase(List<Item__c> cart) {
        Purchase__c purchase = new Purchase__c(
            Account__c = UserInfo.getUserId()
        );
        insert purchase;

        List<PurchaseLine__c> lines = new List<PurchaseLine__c>();
        for (Item__c item : cart) {
            lines.add(new PurchaseLine__c(
                Purchase__c = purchase.Id,
                Item__c = item.Id,
                Quantity__c = item.get('quantity')
            ));
        }
        insert lines;
    }
}
