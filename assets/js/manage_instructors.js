(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of instructor id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=instructor_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getInstructor(record_id) {
    return $.get("http://localhost:1337/instructor/" + record_id, function(data) {
      console.log("got instructor");
    })
  }

  //erics quick thought for generic shit
  // function buildIDropdown(model, keyfield, displayfield){
  //   promise = $.get("http://localhost:1337/"+model+"/");
  //
  //   let dropdown = "";
  //   promise.done(function(data){
  //     dropdown += "<select class='form-control' name='"+keyfield+"'>";
  //     $.each(data, function(index, value){
  //       dropdown += `<option value='${value[field]}'>${value[displayfield]}</option>`
  //     })
  //     dropdown += "</select>";
  //   }).done(function(){
  //     $("#majorDropdown").html(dropdown);
  //   })
  // }

  $(function() {

//I brought this in from the read.js to make it a DataTable
    $('#instructorTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      colReorder: true,
      "scrollX": true
      // columnDefs makes the 0 index 7th column that stores the buttons wider
      // columnDefs: [
      //   {width: '20%', targets:7}
      // ]
    });

//jquery validate the fields
  var validator = $("#manageInstructorForm").validate({
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
        major_id: {
          required: false
        },
        years_of_experience: {
          required: false
        },
        tenured: {
          required: true,
          max: 1
        }
      },
      messages: {
        first_name: {
          required: "We need your first name",
          minlength: jQuery.validator.format("At least 2 characters required for first name!")
        },
        last_name: {
          required: "We need your last name",
          minlength: jQuery.validator.format("At least 2 characters required for last name!")
        },
        tenured: {
          required: "1 for yes and 0 for no.",
          max: jQuery.validator.format("1 or 0")
        }
      }
    });


    //initialize variables for items in the DOM we will work with
    let manageInstructorForm = $("#manageInstructorForm");
    let addInstructorButton = $("#addInstructorButton");

    //add student button functionality
    addInstructorButton.click(function() {
      $("input").val('');
      validator.resetForm();
      manageInstructorForm.attr("action", "/create_instructor");
      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })

    $("#instructorTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("instructorid")
      validator.resetForm();
      manageInstructorForm.find("input[name=instructor_id]").val(recordId);
      manageInstructorForm.attr("action", "/update_instructor");
      let instructor = getInstructor(recordId);

      //populate form when api call is done (after we get student to edit)
      instructor.done(function(data) {
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

      manageInstructorForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })


    $("#instructorTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("instructorid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Instructor": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

   promise = $.get("http://localhost:1337/major");

   let dropdown = "";
   promise.done(function(data){
     dropdown += "<select class='form-control' name='major_id'>";
     $.each(data, function(index, value){
       dropdown += `<option value='${value.major_id}'>${value.major}</option>`
     })
     dropdown += "</select>";
   }).done(function(){
     $("#majorDropdown").html(dropdown);
   })

})();

// we will be adding stuff to this js file like we did yesterday to make our buttons
// into drop downs and stuff
