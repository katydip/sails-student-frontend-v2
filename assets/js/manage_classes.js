(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getClass(record_id) {
    return $.get("http://localhost:1337/class/" + record_id, function(data) {
      console.log("got class");
    })
  }

  $(function() {

//I brought this in from the read.js to make it a DataTable
    $('#classTable').DataTable({
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
  var validator = $("#manageClassForm").validate({
      errorClass: "text-danger",
      rules: {
        instructor_id: {
          required: false
        },
        subject: {
          required: true,
          minlength: 2
        },
        course: {
          required: true,
          minlength: 3
        }
      },
      messages: {
        subject: {
          required: "Course Subject required",
          minlength: jQuery.validator.format("What subject are you taking?")
        },
        course: {
          required: "Course Number required",
          minlength: jQuery.validator.format("Enter a valid course: 101, 202, etc.")
        }
      }
    });


    //initialize variables for items in the DOM we will work with
    let manageClassForm = $("#manageClassForm");
    let addClassButton = $("#addClassButton");
    let firstName = $("#first_name");

    //add class button functionality
    addClassButton.click(function() {
      $("input").val('');
      validator.resetForm();
      manageClassForm.attr("action", "/create_class");
      manageClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageClassForm.submit()
          }
        }
      });
    })

    $("#classTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("classid")
      manageClassForm.find("input[name=class_id]").val(recordId);
      manageClassForm.attr("action", "/update_class");
      let currentClass = getClass(recordId);

      //populate form when api call is done (after we get student to edit)
      currentClass.done(function(data) {
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

      manageClassForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageClassForm.submit()
          }
        }
      });
    })


    $("#classTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Class": function() {
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
