function updateEvents() {
	$.get("/u/api/events", function(result) {
		$("#calendar").fullCalendar('renderEvents', result, true);
	});
}

function test() {
	console.log("form submitted");
}

function postEvent(newEvent) {
	$.ajax({
		type: 'POST',
		url: '/u/api/events',
		data: newEvent,
		success: function() {
		  console.log('success');
		  // $('#flashmessage').text("success").show(0).delay(3500).hide(0);
		},
		error: function() {
		  console.log('error');
		  // $('#flashmessage').text("not JSON format").show(0).delay(3500).hide(0);
		}
	});
}

$(document).ready(function() {
	$("#eventform").on("submit", function(e) {
		e.preventDefault();
		console.log("you see the form submit")
	});

	$("#calendar").fullCalendar({
		height: "parent",
		navLinks: true,
		selectable: true,
		selectHelper: true,
		selectOverlap: false,
		//selectOverlap: false,
		selectMinDistance: 13,
		allDayDefault: false,
		allDaySlot: false,
		selectAllow: function(selectInfo) {
			var duration = moment.duration(selectInfo.end.diff(selectInfo.start));
			return selectInfo.start > Date.now() && duration.asHours() <= 24;
		},
		select: function(start, end) {
			$("#addeventmodal").modal("toggle");
			$("#dtpstart").data("DateTimePicker").date(start);
			$("#dtpend").data("DateTimePicker").date(end);
			$("#calendar").fullCalendar("unselect");
		},
		eventLimit: true,
		buttonText: {
			listDay: "day",
			listWeek: "week",
			listMonth: "month"
		},
		customButtons: {
			toDashboard: {
				text: "Dashboard",
				click: function() {
					window.location = "/u/dashboard";
				}
			},
			toggleList: {
				text: "list",
				click: function() {
					var currentView = $("#calendar").fullCalendar('getView').type;
					if ($(".fc-toggleList-button").hasClass("fc-state-active")) { // if in list view
						$("#calendar").fullCalendar("option", { header: { left: "toDashboard agendaDay,agendaWeek,month,toggleList" } });
						if (currentView === "listDay") {
							$("#calendar").fullCalendar("changeView", "agendaDay");
						} else if (currentView === "listWeek") {
							$("#calendar").fullCalendar("changeView", "agendaWeek");
						} else if (currentView === "listMonth") {
							$("#calendar").fullCalendar("changeView", "month");
						}
					} else {
						$("#calendar").fullCalendar("option", { header: { left: "toDashboard listDay,listWeek,listMonth,toggleList" } });
						$(".fc-toggleList-button").toggleClass("fc-state-active");
						if (currentView === "agendaDay") {
							$("#calendar").fullCalendar("changeView", "listDay");
						} else if (currentView === "agendaWeek") {
							$("#calendar").fullCalendar("changeView", "listWeek");
						} else if (currentView === "month") {
							$("#calendar").fullCalendar("changeView", "listMonth");
						}
					}
				}
			},
			newEvent: {
				text: "add event",
				click: function() {
					$("#addeventmodal").modal("toggle");
					console.log("wow! you scheduled something!");
				}
			},
			viewMyEvents: {
				text: "my events",
				click: function() {
					console.log("viewing!");
				}
			},
		},
		header: {
			left: "toDashboard agendaDay,agendaWeek,month,toggleList",
			center: "title",
			right: "newEvent,viewMyEvents today prev,next"
		}
	});
	updateEvents(); // get the events and render them

		//- DATETIMEPICKER
	$("#dtpstart").datetimepicker({
		minDate: moment(),
		stepping: 30
	});
	$("#dtpend").datetimepicker({
		maxDate: moment().add(1, "years"),
		stepping: 30,
		useCurrent: false
	});

	$("#dtpstart").on("dp.change", function(e) {
		$("#dtpend").data("DateTimePicker").minDate(e.date);
	});
	$("#dtpend").on("dp.change", function(e) {
		$("#dtpstart").data("DateTimePicker").maxDate(e.date);
	});

});