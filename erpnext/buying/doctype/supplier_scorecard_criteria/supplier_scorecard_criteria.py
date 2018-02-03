# -*- coding: utf-8 -*-
# Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
import re
from frappe.model.document import Document

class InvalidFormulaVariable(frappe.ValidationError): pass

class SupplierScorecardCriteria(Document):
	def validate(self):
		self.validate_variables()
		self.validate_formula()

	def validate_variables(self):
		# make sure all the variables exist
		_get_variables(self)

	def validate_formula(self):
		# evaluate the formula with 0's to make sure it is valid
		test_formula = self.formula.replace("\r", "").replace("\n", "")

		regex = r"\{(.*?)\}"

		mylist = re.finditer(regex, test_formula, re.MULTILINE | re.DOTALL)
		for dummy1, match in enumerate(mylist):
			for dummy2 in range(0, len(match.groups())):
				test_formula = test_formula.replace('{' + match.group(1) + '}', "0")

		test_formula = test_formula.replace('&lt;','<').replace('&gt;','>')
		try:
			frappe.safe_eval(test_formula,  None, {'max':max, 'min': min})
		except Exception:
			frappe.throw(_("Error evaluating the criteria formula"))



@frappe.whitelist()
def get_scoring_criteria(criteria_name):
	criteria = frappe.get_doc("Supplier Scorecard Criteria", criteria_name)

	return criteria


@frappe.whitelist()
def get_criteria_list():
	criteria = frappe.db.sql("""
		SELECT
			scs.name
		FROM
			`tabSupplier Scorecard Criteria` scs""",
			{}, as_dict=1)

	return criteria

@frappe.whitelist()
def get_variables(criteria_name):
	criteria = frappe.get_doc("Supplier Scorecard Criteria", criteria_name)
	return _get_variables(criteria)

def _get_variables(criteria):
	my_variables = []
	regex = r"\{(.*?)\}"

	mylist = re.finditer(regex, criteria.formula, re.MULTILINE | re.DOTALL)
	for dummy1, match in enumerate(mylist):
		for dummy2 in range(0, len(match.groups())):
			try:
				#var = frappe.get_doc("Supplier Scorecard Variable", {'param_name' : d})
				var = frappe.db.sql("""
					SELECT
						scv.name
					FROM
						`tabSupplier Scorecard Variable` scv
					WHERE
						param_name=%(param)s""",
						{'param':match.group(1)},)[0][0]
				my_variables.append(var)
			except Exception:
				# Ignore the ones where the variable can't be found
				frappe.throw(_('Unable to find variable: ') + str(match.group(1)), InvalidFormulaVariable)
				#pass


	#frappe.msgprint(str(my_variables))
	return my_variables
