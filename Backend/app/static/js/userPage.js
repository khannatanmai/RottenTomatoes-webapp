var csrf_token = '<OIAJmd102jAJsdoajsodjOKJ12iplqzZXxcj012j9123kj>';

var deleteReview = function(reviews_id)
{
	$.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if(settings.type=='POST') {
                console.log('HEY');
                xhr.setRequestHeader('X-CSRF-Token', csrf_token);
            }
        }
    });
    $.ajax({
	url: 'http://127.0.0.1:8080/reviews/delete',
	method: 'POST',
	data: {
	    reviews_id: reviews_id,
	},
	success: function(response)
	{
	    console.log(response);
	    populateUser();
	},
	error: function(response)
	{
	    console.log('Error in Deleting Review');
	    console.log(response);
	},
    });
}

var getEntName = function(ent_id)
{
    toreturn = "";

    $.ajax({
	url: 'http://127.0.0.1:8080/entertainment',
	method: 'GET',
	async: false,
	data: {
	    ent_id: ent_id,
	},
	success: function(response)
	{
	    ent = response.ent;
	    toreturn = ent.name;
	},
	error: function(response)
	{
	    console.log("Error in getting Ent Name");
	    console.log(response);
	},
    });
    
    return toreturn;
}

var populateReviewsList = function(reviewsArray)
{
    var htmlnew = "";

    for(var i in reviewsArray)
    {
	var ent_name = getEntName(reviewsArray[i].ent_id);
	
	htmlnew += "<tr> <td>" + "<button type='button' class='btn btn-lg btn-primary deleteButton' id='" + reviewsArray[i].reviews_id + "'>Delete</button></td>" +
	"<td>" + ent_name + "</td>" +
	"<td>" + reviewsArray[i].rating + "</td>" +
	"<td>" + reviewsArray[i].review + "</td> </tr>";
    }

    $('#reviews_body').html(htmlnew);
};

var getReviews = function(username)
{
    $.ajax({
	url: 'http://127.0.0.1:8080/reviews_by',
	method: 'GET',
	data: {
	    username: username,
	},
	success: function(response)
	{
	    console.log("Reviews Fetched!");
	    populateReviewsList(response.reviews);
	},
	error: function(response)
	{
	    console.log("Error in fetching reviews!");
	    console.log(response);
	},
    });
};


var populateUser = function()
{	var html="";
	$.ajax({
	    url: 'http://127.0.0.1:8080/login',
	    method: 'GET',
	    
	    success: function(response){
		if(response.success === true){

	    	    var user = response.user;
	    	    var userName="";
		    userName+=user.username;
		    
		    getReviews(userName); //Get Reviews
		    
		    $('#username').html(userName);
		    
		    var dob="";
		    dob+=user.date_of_birth;
		    var dob_new=dob.substring(5,16);
		    $('#dob').html(dob_new);
		    
		    var userType = "";
		    userType+=user.user_type;
		    $('#usertype').html(userType);

		    var email="";
		    email+=user.email;
		    $('#email').html(email);

		    var name="";
		    name+=user.name;
			console.log(name + "--" + user.name);
		    $('#name').html(name);

		    var photo="";
		    photo += "<img src='"+user.photo_link+ "' alt='Photo'>";	
			
		    $('#photo').html(photo);
		}
		else {                                                                                     
			alert("No user logged-in, Sign In to enjoy User Privilages");                         
			window.location.href = "../MainPage/mainPage.html"                                    
		}                              

	    },
	    error: function(response) {
		alert(response+"error");
	    },
	});
};

var uploadPhoto = function(photo_link)
{
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if(settings.type=='POST') {
                console.log('HEY');
                xhr.setRequestHeader('X-CSRF-Token', csrf_token);
            }
        }
    });

	$.ajax({
	url: 'http://127.0.0.1:8080/updatePhoto',
	method: 'POST',
	data: {
	    photo_link: photo_link,
	},
	
	success: function(response)
	{
	  if(response.success === true){
		var photo="";
		photo += "<img src='"+response.user.photo_link+ "' alt='Photo'>";	
			
		$('#photo').html(photo);
	   }	
	},
	error: function(response)
	{
	    console.log("Error in getting Photo");
	    console.log(response);
	},
    });
}

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

$(document).ready(function() {
	csrf_token = randomString(36);
    $("body").bind("ajaxSend", function(elm, xhr, s){
        if (s.type == "POST") {
            xhr.setRequestHeader('X-CSRF-Token', csrf_token);
        }
    });

    populateUser();

    $('#updatePhoto').click(function() {
	var photo_link = $('#photo_link_input').val();
	uploadPhoto(photo_link);
	
	$('#photo_link_input').val("");
    });
    
    $('body').on('click','.deleteButton', function() {
	var reviews_id = $(this).attr('id');
	console.log("Review id: "+ 'reviews_id');

	deleteReview(reviews_id);
    });
});