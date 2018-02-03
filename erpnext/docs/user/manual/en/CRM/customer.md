# Customer

A customer, who is sometimes known as a client, buyer, or purchaser is the one
who receives goods, services, products, or ideas, from a seller for a monetary
consideration. A customer can also receive goods or services from a vendor or
a supplier for other valuable considerations.

A customer is uniquely identified by the Customer ID. Normally this ID is identical to the customer Full Name, but in case of duplicate Full Name, a Name-1 is created as ID.

You can either directly create your Customers via

> Selling > Customer

<img class="screenshot" alt="Create Customer" src="/docs/assets/img/crm/create-customer.gif">

or upload it via the [Data Import Tool](/docs/user/manual/en/setting-up/data/data-import-tool.html).

A Customer can avail the features (operations) in the selling process. The general flow can be summarised as:

<img class="screenshot" alt="Customer" src="/docs/assets/img/crm/customer-to selling-flowchart.jpeg">

> Note: Customers are separate from Contacts and Addresses. A Customer can
have multiple Contacts and Addresses.

### Contacts and Addresses

[Contacts and Addresses](/docs/user/manual/en/CRM/contact.html) in ERPNext are stored separately so that you can
attach multiple Contacts or Addresses to Customers and Suppliers

Thus we may have identical Customer Names that are uniquely identified by the ID. Since the email address is not part of the
customer information, the linking of Customer and User is through Contacts.

### Integration with Accounts

In ERPNext, there is a separate Account record for each Customer, for each
Company.

When you create a new Customer, ERPNext will automatically create an Account
Ledger for the Customer under “Accounts Receivable” in the Company set in the
Customer record.

> Advanced Tip: If you want to change the Account Group under which the
Customer Account is created, you can set it in the Company master. If you want
to create an Account in another Company, just change the Company value and
“Save” the Customer again.

By default, the system does not generate an account for every customer. All
Customers can be booked in one account called Debtors. In order to manage a
separate account for each customer, you have to first create the account under
Accounts Receivable in the [Chart of Accounts](/docs/user/manual/en/accounts/chart-of-accounts.html) and then add it on the customer's
form accounts table.

### Customer Settings

You can link a Price List to a Customer (select “Default Price List”), so that
when you select that Customer, the Price List will be automatically selected.

You can set “Credit Days”, so that it is automatically set due date in the Sales
Invoices made against this Customer. Credit Days can be defined as fixed days or last day of the next month based on invoice date.

You can set how much credit you want to allow for a Customer by adding the
“Credit Limit”. You can also set a global “Credit Limit” in the Company
master. Classifying Customers

ERPNext allows you to group your Customers using [Customer Group](/docs/user/manual/en/CRM/setup/customer-group.html)
and also divide them into [Territories](/docs/user/manual/en/setting-up/territory.html)
Grouping will help you get better analysis of your data and
identify which Customers are profitable and which are not. Territories will
help you set sales targets for the respective territories.
You can also mention [Sales Person](/docs/user/manual/en/CRM/setup/sales-person.html) against a customer.

### Sales Partner

A Sales Partner is a third party distributor / dealer / commission agent /
affiliate / reseller who sells the companies products, for a commission. This
is useful if you make the end sale to the Customer, involving your Sales
Partner.

If you sell to your Sales Partner who in-turn sells it to the Customer, then
you must make a Customer instead.

{next}
