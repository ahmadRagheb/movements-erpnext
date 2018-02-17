// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.ui.form.on("Customer", {
	setup: function(frm) {
		frm.add_fetch('lead_name', 'company_name', 'customer_name');
		frm.add_fetch('default_sales_partner','commission_rate','default_commission_rate');
		frm.set_query('customer_group', {'is_group': 0});
		frm.set_query('default_price_list', { 'selling': 1});
		frm.set_query('account', 'accounts', function(doc, cdt, cdn) {
			var d  = locals[cdt][cdn];
			var filters = {
				'account_type': 'Receivable',
				'company': d.company,
				"is_group": 0
			};

			if(doc.party_account_currency) {
				$.extend(filters, {"account_currency": doc.party_account_currency});
			}

			return {
				filters: filters
			}
		});

		frm.set_query('customer_primary_contact', function(doc) {
			return {
				query: "erpnext.selling.doctype.customer.customer.get_customer_primary_contact",
				filters: {
					'customer': doc.name
				}
			}
		})
		frm.set_value('nationality','Qatar')
	},
	refresh: function(frm) {
		if(frappe.defaults.get_default("cust_master_name")!="Naming Series") {
			frm.toggle_display("naming_series", false);
		} else {
			erpnext.toggle_naming_series();
		}

		frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Customer'}

		frm.toggle_display(['address_html','contact_html'], !frm.doc.__islocal);

		if(!frm.doc.__islocal) {
			frappe.contacts.render_address_and_contact(frm);

			// custom buttons
			frm.add_custom_button(__('Accounting Ledger'), function() {
				frappe.set_route('query-report', 'General Ledger',
					{party_type:'Customer', party:frm.doc.name});
			});

			frm.add_custom_button(__('Accounts Receivable'), function() {
				frappe.set_route('query-report', 'Accounts Receivable', {customer:frm.doc.name});
			});

			// indicator
			erpnext.utils.set_party_dashboard_indicators(frm);

		} else {
			frappe.contacts.clear_address_and_contact(frm);
		}

		var grid = cur_frm.get_field("sales_team").grid;
		grid.set_column_disp("allocated_amount", false);
		grid.set_column_disp("incentives", false);
		frm.set_value('nationality','Qatar')

	},
	validate: function(frm) {
		if(frm.doc.lead_name) frappe.model.clear_doc("Lead", frm.doc.lead_name);

	},
});


frappe.ui.form.on("Customer", {
    first_name: function(frm) {
  		var fullname= fullname_en();
        cur_frm.set_value('customer_name',fullname );
	   	},
    middle_name: function(frm) {
    	var fullname= fullname_en();
        cur_frm.set_value('customer_name', fullname);
	   	},
    last_name: function(frm) {
  		var fullname= fullname_en();
        cur_frm.set_value('customer_name',fullname  );
	   	},
	uk_telephone:function(frm){
		var tel = phonenumber(cur_frm.doc.uk_telephone);
	  },
	 qatari_tel:function(frm){
		var tel = phonenumber_qatar(cur_frm.doc.qatari_tel);
	  },
	  email:function(frm){
	  	var email= validateEmail(cur_frm.doc.email);
	  	if (email==false){
	  	frappe.throw("Enter a valid email address");
		}
	  }


});


function fullname_en() {
    var first_name = cur_frm.doc.first_name;
    var middle_name = cur_frm.doc.middle_name;
    var last_name = cur_frm.doc.last_name;
    var full_name = "";

    first_name_notnull= ( first_name != null);
    first_name_notempty= ( first_name !="");
    first_name_notempty_notulll = (first_name_notnull && first_name_notempty);


    first_name_null= (  first_name == null);
    first_name_empty= ( first_name =="" );
    first_name_empty_null = (first_name_null || first_name_empty);



    middle_name_notnull= ( middle_name != null);
    middle_name_notempty= ( middle_name !="" );
    middle_name_notempty_notulll = (middle_name_notnull && middle_name_notempty);


    middle_name_null= ( middle_name == null);
    middle_name_empty= ( middle_name =="" );
    middle_name_empty_null = (middle_name_null || middle_name_empty);


    last_name_notnull= (  last_name != null);
    last_name_notempty= ( last_name !="" );
    last_name_notempty_notulll = (last_name_notnull && last_name_notempty);


    last_name_null= ( last_name == null);
    last_name_empty= ( last_name =="" );
    last_name_empty_null = (last_name_null  || last_name_empty);




    if ( first_name_notempty_notulll  &&  middle_name_notempty_notulll  && last_name_notempty_notulll ) {
        full_name = first_name + " " + middle_name  + " " + last_name;

    }else if ( first_name_empty_null  && middle_name_notempty_notulll && last_name_notempty_notulll) {
        full_name = middle_name +" "+ last_name;

    }else if (first_name_notempty_notulll &&  middle_name_empty_null &&last_name_notempty_notulll) {
        full_name = first_name  +" "+ last_name;

    }else if (first_name_notempty_notulll &&  middle_name_notempty_notulll && last_name_empty_null) {
        full_name = first_name  +" "+ middle_name;

    }else if ( first_name_empty_null &&  middle_name_notempty_notulll &&  last_name_notempty_notulll) {
        full_name = middle_name +" "+ last_name;

    }else if (first_name_empty_null  &&  middle_name_empty_null && last_name_notempty_notulll ){
        full_name = last_name;

	}else if (first_name_notempty_notulll &&  middle_name_empty_null && last_name_empty_null) {
        full_name = first_name;

	}else if (first_name_empty_null && middle_name_notnull &&   last_name_empty_null) {
        full_name = middle_name;
    }

    return full_name;

    
};

function phonenumber(inputtxt) {

  var phoneno = /^\+44\s?\d{7}$/;
  if(inputtxt.match(phoneno)) {
    return true;
  }  
  else {  
    frappe.throw("Not valid UK telephone number, should start with +44 followed by 7 digits");
    return false;
  }
}


function phonenumber_qatar(inputtxt) {

  var phoneno = /^\+971\s?\d{8}$/;
  if(inputtxt.match(phoneno)) {
    return true;
  }  
  else {  
    frappe.throw("Not valid Qatar telephone number, should start with +971 followed by 8 digits");
    return false;
  }
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
