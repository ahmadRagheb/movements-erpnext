# -*- coding: utf-8 -*-
# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# See license.txt
from __future__ import unicode_literals

import os
import frappe
import unittest
import frappe.utils

# test_records = frappe.get_test_records('Daily Work Summary')

class TestDailyWorkSummary(unittest.TestCase):
	def test_email_trigger(self):
		self.setup_and_prepare_test()
		for d in self.employees:
			# check that email is sent to this employee
			self.assertTrue(d.user_id in [d.recipient for d in self.emails
				if self.settings.subject in d.message])

	def test_email_trigger_failed(self):
		hour = '00'
		if frappe.utils.nowtime().split(':')[0]=='00':
			hour = '01'

		self.setup_and_prepare_test(hour)

		for d in self.employees:
			# check that email is sent to this employee
			self.assertFalse(d.user_id in [d.recipient for d in self.emails
				if self.settings.subject in d.message])

	def test_incoming(self):
		# get test mail with message-id as in-reply-to
		self.setup_and_prepare_test()

		with open(os.path.join(os.path.dirname(__file__), "test_data", "test-reply.raw"), "r") as f:
			test_mails = [f.read().replace('{{ sender }}', self.employees[-1].user_id)\
				.replace('{{ message_id }}', self.emails[-1].message_id)]

		# pull the mail
		email_account = frappe.get_doc("Email Account", "_Test Email Account 1")
		email_account.db_set('enable_incoming', 1)
		email_account.receive(test_mails=test_mails)

		daily_work_summary = frappe.get_doc('Daily Work Summary',
			frappe.get_all('Daily Work Summary')[0].name)

		args = daily_work_summary.get_message_details()

		self.assertTrue('I built Daily Work Summary!' in args.get('replies')[0].content)

	def setup_and_prepare_test(self, hour=None):
		frappe.db.sql('delete from `tabDaily Work Summary`')
		frappe.db.sql('delete from `tabEmail Queue`')
		frappe.db.sql('delete from `tabEmail Queue Recipient`')
		frappe.db.sql('delete from `tabCommunication`')

		self.setup_settings(hour)

		from erpnext.hr.doctype.daily_work_summary_settings.daily_work_summary_settings \
			import trigger_emails
		trigger_emails()

		# check if emails are created
		self.employees = frappe.get_all('Employee', fields = ['user_id'],
			filters=dict(company='_Test Company', status='Active', user_id=('!=', 'test@example.com')))

		self.emails = frappe.db.sql("""select r.recipient, q.message, q.message_id from `tabEmail Queue` as q, `tabEmail Queue Recipient` as r where q.name = r.parent""", as_dict=1)

		frappe.db.commit()

	def setup_settings(self, hour=None):
		# setup email to trigger at this our
		if not hour:
			hour = frappe.utils.nowtime().split(':')[0]
		self.settings = frappe.get_doc('Daily Work Summary Settings')
		self.settings.companies = []

		self.settings.append('companies', dict(company='_Test Company',
			send_emails_at=hour + ':00'))
		self.settings.test_subject = 'this is a subject for testing summary emails'
		self.settings.save()

