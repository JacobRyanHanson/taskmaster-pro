var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
	// Creates elements that make up a task item.
	var taskLi = $("<li>").addClass("list-group-item");
	var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);
	var taskP = $("<p>").addClass("m-1").text(taskText);

	// Appends span and p element to parent li.
	taskLi.append(taskSpan, taskP);

	// Appends to ul list on the page.
	$("#list-" + taskList).append(taskLi);
}

var loadTasks = function() {
	tasks = JSON.parse(localStorage.getItem("tasks"));

	// If nothing is in localStorage, creates a new object to track all task status arrays.
	if (!tasks) {
		tasks = {
			toDo: [],
			inProgress: [],
			inReview: [],
			done: []
		}
	}

	// Loops over object properties.
	$.each(tasks, function(list, arr) {
		// Then loops over sub-array.
		arr.forEach(function(task) {
			createTask(task.text, task.date, list);
		});
	});
}

var saveTasks = function() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

$(".list-group").on("click", "p", function() {
	var text = $(this).text().trim();
	var textInput = $("<textarea>").addClass("form-control").val(text);
	$(this).replaceWith(textInput);
	textInput.trigger("focus");
});

$(".list-group").on("blur", "textarea", function() {
	var text = $(this).val().trim();
	var status = $(this).closest(".list-group").attr("id").replace("list-", "");
	var index = $(this).closest(".list-group-item").index();
	tasks[status][index].text = text;

	saveTasks();

	var taskP = $("<p>").addClass("m-1").text(text);
	$(this).replaceWith(taskP);
});

$(".list-group").on("click", "span", function() {
	var date = $(this).text().trim();
	var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);
	$(this).replaceWith(dateInput);
	dateInput.trigger("focus");
});

$(".list-group").on("blur", "input[type='text']", function() {
	var date = $(this).val().trim();
	var status = $(this).closest(".list-group").attr("id").replace("list-", "");
	var index = $(this).closest(".list-group-item").index();
	tasks[status][index].date = date;

	saveTasks();

	var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);
	$(this).replaceWith(taskSpan);
});

// Modal was triggered.
$("#task-form-modal").on("show.bs.modal", function() {
	// Clears values.
	$("#modalTaskDescription, #modalDueDate").val("");
});

// Modal is fully visible.
$("#task-form-modal").on("shown.bs.modal", function() {
	// Highlights textarea.
	$("#modalTaskDescription").trigger("focus");
});

// Saves button in modal that was clicked.
$("#task-form-modal .btn-primary").click(function() {
	// Gets form values.
	var taskText = $("#modalTaskDescription").val();
	var taskDate = $("#modalDueDate").val();

	if (taskText && taskDate) {
		createTask(taskText, taskDate, "toDo");

		// Closes modal.
		$("#task-form-modal").modal("hide");

		// Saves object values in tasks array.
		tasks.toDo.push({
			text: taskText,
			date: taskDate
		});
		saveTasks();
	}
});

// Removes all tasks.
$("#remove-tasks").on("click", function() {
	for (var key in tasks) {
		tasks[key].length = 0;
		$("#list-" + key).empty();
	}
	saveTasks();
});

// Loads tasks for the first time.
loadTasks();