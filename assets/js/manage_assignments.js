(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of assignment id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=assignment_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getAssignment(record_id) {
    return $.get("http://localhost:1337/assignment/" + record_id, function(data) {
      console.log("got assignment");
    })
  }

  $(function() {

//I brought this in from the read.js to make it a DataTable
$('#assignmentTable').DataTable({
  dom: 'Bfrtip',
  buttons: [
    'copy', 'csv', 'excel', 'pdf', 'print'
  ],
  colReorder: true,
  "scrollX": true
  // this columnDefs makes the 7th column that stores the buttons wider
  // columnDefs: [
  //   {width: '15%', targets:6}
  // ]
});


//jquery validate the fields
  var validator = $("#manageAssignmentForm").validate({
      errorClass: "text-danger",
      rules: {
        student_id: {
          required: false
        },
        assignment_nbr: {
          required: true
        },
        grade_id: {
          required: true,
          max: 5
        },
        class_id: {
          required: false
        }
      },
      messages: {
        assignment_nbr: {
          required: "Assigment number required."
        },
        grade_id: {
          required: "Enter a grade number 1-5",
          max: jQuery.validator.format("Enter a grade 1-5")
        }
      }
    });


    //initialize variables for items in the DOM we will work with
    let manageAssignmentForm = $("#manageAssignmentForm");
    let addAssignmentButton = $("#addAssignmentButton");

    //add assignment button functionality
    addAssignmentButton.click(function() {
      $("input").val('');
      validator.resetForm();
      manageAssignmentForm.attr("action", "/create_assignment");
      manageAssignmentForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageAssignmentForm.submit()
          }
        }
      });
    })

    $("#assignmentTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("assignmentid")
      manageAssignmentForm.find("input[name=assignment_id]").val(recordId);
      manageAssignmentForm.attr("action", "/update_assignment");
      let assignment = getAssignment(recordId);

      //populate form when api call is done (after we get assignment to edit)
      assignment.done(function(data) {
        $.each(data, function(name, val) {
          var $el = $('[name="' + name + '"]'),
            type = $el.attr('type');

          switch (type) {
            case 'checkbox':
              $el.attr('checked', 'checked');
              break;
            case 'radio':
              $el.filter('[value="' + val + '"]').attr('checked', 'checked');
              break;
            default:
              $el.val(val);
          }
        });
      })

      manageAssignmentForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageAssignmentForm.submit()
          }
        }
      });
    })


    $("#assignmentTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("assignmentid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Assignment": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();

// we will be adding stuff to this js file like we did yesterday to make our buttons
// into drop downs and stuff
