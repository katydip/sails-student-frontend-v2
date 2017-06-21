(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=student_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudentClass(record_id) {
    return $.get("http://localhost:1337/student_class/" + record_id, function(data) {
      console.log("got student class");
    })
  }

  $(function() {

//I brought this in from the read.js to make it a DataTable
    $('#student_classTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      colReorder: true,
      "scrollX": true
      //this columnDefs makes the 7th column that stores the buttons wider
      // columnDefs: [
      //   {width: '20%', targets:7}
      // ]
    });

//jquery validate the fields
  var validator = $("#manageStudentClassForm").validate({
      errorClass: "text-danger",
      rules: {
        student_id: {
          required: true
        },
        class_id: {
          required: true
        }
      },
      messages: {
        student_id: {
          required: "Student ID required",
          // minlength: jQuery.validator.format("...!")
        },
        class_id: {
          required: "Class ID required",
          // minlength: jQuery.validator.format("...!")
        }
      }
    });


    //initialize variables for items in the DOM we will work with
    let manageStudentClassForm = $("#manageStudentClassForm");
    let addStudentClassButton = $("#addStudentClassButton");

    //add student button functionality
    addStudentClassButton.click(function() {
      $("input").val('');
      validator.resetForm();
      manageStudentClassForm.attr("action", "/create_student_class");
      manageStudentClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })

    $("#student_classTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("studentclassid")
      validator.resetForm();
      manageStudentClassForm.find("input[name=student_class_id]").val(recordId);
      manageStudentClassForm.attr("action", "/update_student_class");
      let student_class = getStudentClass(recordId);

      //populate form when api call is done (after we get student to edit)
      student_class.done(function(data) {
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

      manageStudentClassForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })


    $("#student_classTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("studentclassid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete StudentClass": function() {
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
