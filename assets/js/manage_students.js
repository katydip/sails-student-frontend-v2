(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=student_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudent(record_id) {
    return $.get("http://localhost:1337/student/" + record_id, function(data) {
      console.log("got student");
    })
  }

  $(function() {

//I brought this in from the read.js to make it a DataTable
    $('#studentTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      colReorder: true,
      "scrollX": true,
      //this columnDefs makes the 7th column that stores the buttons wider
      columnDefs: [
        {width: '20%', targets:7}
      ]
    });

//jquery validate the fields
  var validator = $("#manageStudentForm").validate({
      errorClass: "text-danger",
      rules: {
        first_name: {
          required: true,
          minlength: 2
        },
        last_name: {
          required: true,
          minlength: 2
        },
        start_date: {
          required: true,
          dateISO: true
        }
      },
      messages: {
        first_name: {
          required: "We need your first name to contact you",
          minlength: jQuery.validator.format("At least 2 characters required for first name!")
        },
        last_name: {
          required: "We need your last name to contact you",
          minlength: jQuery.validator.format("At least 2 characters required for last name!")
        },
        start_date: {
          required: "We need a valid date to contact you",
          dateISO: jQuery.validator.format("Please enter a valid format yyyy-mm-dd")
        }
      }
    });


    //initialize variables for items in the DOM we will work with
    let manageStudentForm = $("#manageStudentForm");
    let addStudentButton = $("#addStudentButton");

    //add student button functionality
    addStudentButton.click(function() {
      $("input").val('');
      validator.resetForm();
      manageStudentForm.attr("action", "/create_student");
      manageStudentForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageStudentForm.submit()
          }
        }
      });
    })

    $("#studentTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("studentid")
      validator.resetForm();
      manageStudentForm.find("input[name=student_id]").val(recordId);
      manageStudentForm.attr("action", "/update_student");
      let student = getStudent(recordId);

      //populate form when api call is done (after we get student to edit)
      student.done(function(data) {
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

      manageStudentForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageStudentForm.submit()
          }
        }
      });
    })


    $("#studentTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("studentid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Student": function() {
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
