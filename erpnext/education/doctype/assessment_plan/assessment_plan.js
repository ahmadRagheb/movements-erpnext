// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt


frappe.ui.form.on("Assessment Plan", {
	setup: function(frm) {
		frm.add_fetch("student_group", "course", "course");
		frm.add_fetch("student_group", "program", "program");
		frm.add_fetch("student_group", "academic_year", "academic_year");
		frm.add_fetch("student_group", "academic_term", "academic_term");
		frm.add_fetch("examiner", "instructor_name", "examiner_name");
		frm.add_fetch("supervisor", "instructor_name", "supervisor_name");
		frm.add_fetch("course", "default_grading_scale", "grading_scale");
	},

	onload: function(frm) {
		frm.set_query("assessment_group", function(doc, cdt, cdn) {
			return{
				filters: {
					'is_group': 0
				}
			};
		});
		frm.set_query('grading_scale', function(){
			return {
				filters: {
					docstatus: 1
				}
			};
		});
	},

	refresh: function(frm) {
		if (frm.doc.docstatus == 1) {
			frm.add_custom_button(__("Assessment Result"), function() {
				frappe.route_options = {
					assessment_plan: frm.doc.name,
					student_group: frm.doc.student_group
				}
				frappe.set_route("Form", "Assessment Result Tool");
			});
		}
	},

	course: function(frm) {
		if (frm.doc.course && frm.doc.maximum_assessment_score) {
			frappe.call({
				method: "erpnext.education.api.get_assessment_criteria",
				args: {
					course: frm.doc.course
				},
				callback: function(r) {
					if (r.message) {
						frm.doc.assessment_criteria = [];
						$.each(r.message, function(i, d) {
							var row = frappe.model.add_child(frm.doc, "Assessment Plan Criteria", "assessment_criteria");
							row.assessment_criteria = d.assessment_criteria;
							row.maximum_score = d.weightage / 100 * frm.doc.maximum_assessment_score;
						});
					}
					refresh_field("assessment_criteria");

				}
			});
		}
	},

	maximum_assessment_score: function(frm) {
		frm.trigger("course");
	}
});