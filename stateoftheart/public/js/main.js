$(document).ready(function(){
	$.ajax({
        type: 'GET',
        url: '/getposts',
        success: function(data){
          displayData(data);
        }
    });
	$("#submit-button").click(function() {
  		$('.submit-modal').toggle();
    	$('.overlay').toggle();
	});

	$("#artist-button").click(function() {
  		$('.artist-modal').toggle();
    	$('.overlay').toggle();
	});

	$(document).keypress(function(e) {
    if(e.which == 13) {
    	e.preventDefault();
       	var text = $('#main-search').val();
       	console.log(text);
       	$("#media-display").empty();
        $.ajax({
        	type: 'GET',
        	url: '/getartby/' + text,
        	success: function(data){
          		displayData(data);
        	}
    		});
    	}
	});

	$("#all-button").click(function() {
		$("#media-display").empty();
  		$.ajax({
        type: 'GET',
        url: '/getposts',
        success: function(data){
          displayData(data);
        }
    	});
	});

	$("#sunday-button").click(function() {
		$("#media-display").empty();
  		$.ajax({
        type: 'GET',
        url: '/getweekend',
        success: function(data){
          displayData(data);
        }
    	});
	});

	$("#god-button").click(function() {
		$("#media-display").empty();
  		$.ajax({
        type: 'GET',
        url: '/getgodexhibit',
        success: function(data){
          displayData(data);
        }
    	});
	});

	$("#paintings-button").click(function() {
		$("#media-display").empty();
  		$.ajax({
        type: 'GET',
        url: '/getpaintings',
        success: function(data){
          displayData(data);
        }
    	});
	});

	$("#statues-button").click(function() {
		$("#media-display").empty();
  		$.ajax({
        type: 'GET',
        url: '/getstatues',
        success: function(data){
          displayData(data);
        }
    	});
	});

	$("#sculptures-button").click(function() {
		$("#media-display").empty();
  		$.ajax({
        type: 'GET',
        url: '/getsculptures',
        success: function(data){
          displayData(data);
        }
    	});
	});

	$("#other-button").click(function() {
		$("#media-display").empty();
  		$.ajax({
        type: 'GET',
        url: '/getother',
        success: function(data){
          displayData(data);
        }
    	});
	});

	$("#submit-artist-button").click(function() {
  		$('.artist-modal').toggle();
    	$('.overlay').toggle();
    	location.reload();
	});

	$("#submit-art-button").click(function() {
  		$('.submit-modal').toggle();
    	$('.overlay').toggle();
    	location.reload();
	});
	$('input[type=radio][name=type]').on('change', function() {
     switch($(this).val()) {
         case 'painting':
             painting();
             break;
         case 'sculpture':
             sculpture();
             break;
         case 'statue':
             statue();
             break;
         case 'other':
             other();
             break;
     }
	});

	function displayData(data){
		for(var i = 0; i < data.length; i++){
			console.log("AYYY");
			var our_d = data[i];
			console.log(our_d);
				$("#media-display").append("<img id=\"display-image\"src=" + our_d.img+ ">"+
				"<h1 id=\"art-header\">"+our_d.Title+"</h1>"+
				"<table id=\"art-table\"><tr>"+
				"<td id=\"display-t\">Artist: " +our_d.Artist+"</td>"+
				"<td id=\"display-t\">Year: " +our_d.Year+"</td>"+
				"<td id=\"display-t\">Type: " +our_d.Type+"</td>"+
				"<tr id=\"display-t\"><td>Origin: "+our_d.Origin+"</td>"+
				"<td id=\"display-t\">Style: " +our_d.style+"</td>"+
				"<td id=\"display-t\">Epoch: "+our_d.Epoch+"</td>"+
				"</tr></table><p>Description: "+our_d.Description+"</p>");
		}
	}

	function painting(){
		$("#rest-of-form").empty();
		$( "#rest-of-form" ).append( "<label>Style</label><br><input type=\"text\" name=\"style\">"+
			"<br>"+
			"<label>Paint Type</label><br><input type=\"text\" name=\"paint_type\">"+
			"<br>"+
			"<label>Paint Material</label><br><input type=\"text\" name=\"paint_material\">");
	}

	function sculpture(){
		$("#rest-of-form").empty();
		$( "#rest-of-form" ).append(  "<label>Style</label><br><input type=\"text\" name=\"style\">"+
			"<br>"+
			"<label>Material: </label><br><input type=\"+text+\" name=\"material\">"+
			"<br>"+
			"<label>Height</label><br><input type=\"number\" name=\"height\">"+
			"<br>"+
			"<label>Weight</label><br><input type=\"number\" name=\"weight\">" );
	}

	function statue(){
		$("#rest-of-form").empty();
		$( "#rest-of-form" ).append( "<label>Style</label><br><input type=\"text\" name=\"style\">"+
			"<br>"+
			"<label>Material: </label><br><input type=\"+text+\" name=\"material\">"+
			"<br>"+
			"<label>Height</label><br><input type=\"number\" name=\"height\">"+
			"<br>"+
			"<label>Weight</label><br><input type=\"number\" name=\"weight\">" );
	}

	function other(){
		$("#rest-of-form").empty();
		$( "#rest-of-form" ).append("<label>Style</label><br><input type=\"text\" name=\"style\">"+
			"<br>"+
			"<label>Type</label><br><input type=\"text\" name=\"type2\">" );
	}
});