(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of major id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=major_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajor(record_id) {
    return $.get("http://localhost:1337/major/" + record_id, function(data) {
      console.log("got major");
    })
  }

  $(function() {

//I brought this in from the read.js to make it a DataTable
    $('#majorTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      colReorder: true,
      "scrollX": true,
      //this columnDefs makes the 7th column that stores the buttons wider
      // columnDefs: [
      //   {width: '20%', targets:7}
      // ]
    });

//jquery validate the fields
  var validator = $("#manageMajorForm").validate({
      errorClass: "text-danger",
      rules: {
        major: {
          required: true,
          minlength: 2
        },
        sat: {
          required: true,
          minlength: 3
        }
      },
      messages: {
        major: {
          required: "Major required.",
          minlength: jQuery.validator.format("At least 2 characters required for major!")
        },
        sat: {
          required: "SAT Score required",
          minlength: jQuery.validator.format("Please enter a valid SAT Score from 400-1600")
        }
      }
    });
  //

    //initialize variables for items in the DOM we will work with
    let manageMajorForm = $("#manageMajorForm");
    let addMajorButton = $("#addMajorButton");
    let firstName = $("#first_name");

    //add major button functionality
    addMajorButton.click(function() {
      $("input").val('');
      validator.resetForm();
      manageMajorForm.attr("action", "/create_major");
      manageMajorForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageMajorForm.submit()
          }
        }
      });
    })

    $("#majorTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("majorid")
      validator.resetForm();
      manageMajorForm.find("input[name=major_id]").val(recordId);
      manageMajorForm.attr("action", "/update_major");
      let major = getMajor(recordId);

      //populate form when api call is done (after we get major to edit)
      major.done(function(data) {
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

      manageMajorForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageMajorForm.submit()
          }
        }
      });
    })


    $("#majorTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("majorid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Major": function() {
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
